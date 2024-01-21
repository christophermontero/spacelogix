import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { SigninDto, SignupDto } from '../src/auth/dto';
import { EditProductDto, ProductDto } from '../src/products/dto';
import { Currency } from '../src/products/interface/product.interface';
import { EditUserDto } from '../src/users/dto';
import { UserRole } from '../src/users/interface/user.interface';

describe('SpaceLogix e2e tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );
    await app.init();
    await app.listen(3000);

    pactum.request.setBaseUrl('http://localhost:3000/api/v1');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Authorization feature', () => {
    describe('signup', () => {
      let signupDto: SignupDto;

      beforeEach(() => {
        signupDto = {
          name: 'Username',
          email: 'customer1@mailinator.com',
          password: 't2eTs+302*',
          phone: '98765432',
          address: 'Fake St. 123',
          city: 'user city',
          country: 'user country',
          role: UserRole.Customer
        };
      });

      it('should return bad request error if the password is invalid', () => {
        signupDto.password = '123456';
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should create a new customer', () =>
        pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.CREATED));

      it('should create a new supplier', () => {
        signupDto = {
          ...signupDto,
          email: 'supplier1@mailinator.com',
          role: UserRole.Supplier
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.CREATED);
      });

      it('should create a new transporter', () => {
        signupDto = {
          ...signupDto,
          email: 'transporter1@mailinator.com',
          role: UserRole.Transporter
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.CREATED);
      });

      it('should return conflict error if user already exists', () =>
        pactum
          .spec()
          .post('/auth/signup')
          .withBody(signupDto)
          .expectStatus(HttpStatus.CONFLICT));
    });

    describe('signin', () => {
      let signinDto: SigninDto;

      beforeEach(() => {
        signinDto = {
          email: 'customer1@mailinator.com',
          password: 't2eTs+302*',
          role: UserRole.Customer
        };
      });

      it('should return bad request error if the role is invalid', () => {
        signinDto.role = null;
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should return unauthorized error if the password is wrong', () => {
        signinDto.password = '*t2eTs+302';
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.UNAUTHORIZED);
      });

      it('should return not found error if user does not exist', () => {
        signinDto.email = 'supplier1@mailinator.com';
        pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.NOT_FOUND);
      });

      it('should start customer session', () =>
        pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.OK)
          .stores('customerToken', 'data.token'));

      it('should start supplier session', () => {
        signinDto = {
          email: 'supplier1@mailinator.com',
          password: 't2eTs+302*',
          role: UserRole.Supplier
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.OK)
          .stores('supplierToken', 'data.token');
      });

      it('should start transporter session', () => {
        signinDto = {
          email: 'transporter1@mailinator.com',
          password: 't2eTs+302*',
          role: UserRole.Transporter
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signinDto)
          .expectStatus(HttpStatus.OK)
          .stores('transporterToken', 'data.token');
      });
    });

    describe('signout', () => {
      it('should return unauthorized error if the token is invalid', () =>
        pactum
          .spec()
          .get('/users/me')
          .withBearerToken('12345')
          .expectStatus(HttpStatus.UNAUTHORIZED));

      it('should close user session', () =>
        pactum
          .spec()
          .get('/auth/signout')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.OK));
    });
  });

  describe('User feature', () => {
    describe('profile', () => {
      it('should return unauthorized error if the token is invalid', () =>
        pactum
          .spec()
          .get('/users/me')
          .withBearerToken('12345')
          .expectStatus(HttpStatus.UNAUTHORIZED));

      it('should get user profile info', () =>
        pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.OK));
    });

    describe('update', () => {
      let editUserDto: EditUserDto;

      beforeEach(() => {
        editUserDto = {
          name: 'Customer1',
          phone: '98765432',
          country: 'New country',
          city: 'New city',
          address: 'New address'
        };
      });

      it('should return unauthorized error if the token is invalid', () =>
        pactum
          .spec()
          .patch('/users')
          .withBearerToken('12345')
          .expectStatus(HttpStatus.UNAUTHORIZED));

      it('should update a existing user', () =>
        pactum
          .spec()
          .patch('/users')
          .withBearerToken('$S{customerToken}')
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK));
    });
  });

  describe('Products feature', () => {
    let productDto: Partial<ProductDto>;

    beforeEach(() => {
      productDto = {
        name: 'Product 1',
        description: 'Product description',
        price: 1000,
        currency: Currency.USD,
        stock: 100
      };
    });

    describe('create', () => {
      it('should return unauthorized error if the token is invalid', () =>
        pactum
          .spec()
          .post('/products')
          .withBearerToken('12345')
          .expectStatus(HttpStatus.UNAUTHORIZED));

      it('should return unauthorized error if the role is invalid', () =>
        pactum
          .spec()
          .post('/products')
          .withBearerToken('$S{customerToken}')
          .withBody(productDto)
          .expectStatus(HttpStatus.FORBIDDEN));

      it('should return bad request error if the name is empty', () => {
        productDto.name = '';
        return pactum
          .spec()
          .post('/products')
          .withBearerToken('$S{supplierToken}')
          .withBody(productDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should create a new product', () =>
        pactum
          .spec()
          .post('/products')
          .withBearerToken('$S{supplierToken}')
          .withBody(productDto)
          .expectStatus(HttpStatus.CREATED)
          .stores('productId', 'data.productId'));
    });

    describe('get', () => {
      it('should get all products for a customer', () =>
        pactum
          .spec()
          .get('/products')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.OK));

      it('should get all products by role', () =>
        pactum
          .spec()
          .get('/products')
          .withBearerToken('$S{supplierToken}')
          .expectStatus(HttpStatus.OK));
    });

    describe('getById', () => {
      it('should return not found error if the product id is invalid', () =>
        pactum
          .spec()
          .get('/products/{productId}')
          .withPathParams('productId', '65ad5f4309092d45d58c9d45')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.NOT_FOUND));

      it('should get product by id', () =>
        pactum
          .spec()
          .get('/products/{productId}')
          .withPathParams('productId', '$S{productId}')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.OK));
    });

    describe('update', () => {
      let editProductDto: EditProductDto;

      beforeAll(() => {
        editProductDto = {
          name: 'New product name',
          description: 'New description',
          price: 350,
          currency: Currency.COP,
          stock: 150
        };
      });

      it('should return unauthorized error if the role is invalid', () =>
        pactum
          .spec()
          .patch('/products/{productId}')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.FORBIDDEN));

      it('should return bad request error if the price is less than zero', () => {
        editProductDto.price = -1;
        return pactum
          .spec()
          .patch('/products/{productId}')
          .withPathParams('productId', '$S{productId}')
          .withBearerToken('$S{supplierToken}')
          .withBody(editProductDto)
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should return not found error if the product id not exists', () =>
        pactum
          .spec()
          .patch('/products/{productId}')
          .withPathParams('productId', '65ad5f4309092d45d58c9d45')
          .withBearerToken('$S{supplierToken}')
          .expectStatus(HttpStatus.NOT_FOUND));

      it('should update the product', () =>
        pactum
          .spec()
          .patch('/products/{productId}')
          .withPathParams('productId', '$S{productId}')
          .withBearerToken('$S{supplierToken}')
          .expectStatus(HttpStatus.OK));
    });

    describe('delete', () => {
      it('should return unauthorized error if the role is invalid', () =>
        pactum
          .spec()
          .delete('/products/{productId}')
          .withBearerToken('$S{customerToken}')
          .expectStatus(HttpStatus.FORBIDDEN));

      it('should return not found error if the product id not exists', () =>
        pactum
          .spec()
          .delete('/products/{productId}')
          .withPathParams('productId', '65ad5f4309092d45d58c9d45')
          .withBearerToken('$S{supplierToken}')
          .expectStatus(HttpStatus.NOT_FOUND));

      it('should remove the product', () =>
        pactum
          .spec()
          .delete('/products/{productId}')
          .withPathParams('productId', '$S{productId}')
          .withBearerToken('$S{supplierToken}')
          .expectStatus(HttpStatus.OK));
    });
  });
});
