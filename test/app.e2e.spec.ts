import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { SigninDto, SignupDto } from '../src/auth/dto';
import { UserRole } from '../src/users/interface/user.interface';

describe('AuthController', () => {
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

  describe('signup', () => {
    let signupDto: SignupDto;

    beforeEach(() => {
      signupDto = {
        name: 'Customer1',
        email: 'customer1@mailinator.com',
        password: 't2eTs+302*',
        phone: '98765432',
        address: 'Fake St. 123',
        city: 'Customer1 City',
        country: 'Customer1 Country',
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

    it('should create a new user', () =>
      pactum
        .spec()
        .post('/auth/signup')
        .withBody(signupDto)
        .expectStatus(HttpStatus.CREATED));

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

    it('should start user session', () =>
      pactum
        .spec()
        .post('/auth/signin')
        .withBody(signinDto)
        .expectStatus(HttpStatus.OK)
        .stores('userToken', 'data.token'));
  });

  describe('signout', () => {
    it('should close user session', () =>
      pactum
        .spec()
        .get('/auth/signout')
        .withBearerToken(`$S{userToken}`)
        .expectStatus(HttpStatus.OK));
  });
});
