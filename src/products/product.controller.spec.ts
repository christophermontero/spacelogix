import {
  ForbiddenException,
  HttpStatus,
  NotFoundException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ProductModel } from '../mockData/product.model.mock';
import { User, UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { EditProductDto, ProductDto } from './dto';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let user: Partial<User>;
  let dto: Partial<ProductDto>;
  let productId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: 'ProductModel',
          useValue: ProductModel
        }
      ]
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
    user = {
      name: 'John Doe',
      email: 'johndoe@mailinator.com',
      phone: '98765432',
      address: 'Fake St. 123',
      city: 'John Doe City',
      country: 'John Doe Country',
      role: UserRole.Supplier
    };
    dto = {
      supplier: {
        name: 'John Doe',
        email: 'johndoe@mailinator.com',
        phone: '98765432',
        address: 'Fake St. 123',
        city: 'John Doe City',
        country: 'John Doe Country'
      }
    };
    productId = 'productId';
  });

  describe('create', () => {
    it('should create a product for a supplier', async () => {
      productService.create = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.create(
        user as User,
        res as Response,
        dto as ProductDto
      );
      expect(productService.create).toHaveBeenCalledWith(dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should throw ForbiddenException if role is invalid', async () => {
      user = { role: UserRole.Customer };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.create(
          user as User,
          res as Response,
          dto as ProductDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(httpResponses.FORBIDDEN.message);
      }
    });
  });

  describe('update', () => {
    it('should update a product for a supplier', async () => {
      dto = { price: 1 };
      productService.update = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.update(
        user as User,
        res as Response,
        productId,
        dto as EditProductDto
      );
      expect(productService.update).toHaveBeenCalledWith(productId, dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw ForbiddenException if role is invalid', async () => {
      user = { role: UserRole.Customer };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.update(
          user as User,
          res as Response,
          productId,
          dto as EditProductDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(httpResponses.FORBIDDEN.message);
      }
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productService.update = jest.fn().mockResolvedValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.update(
          user as User,
          res as Response,
          productId,
          dto as EditProductDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.PRODUCT_NOT_EXISTS.message);
      }
    });
  });

  describe('get', () => {
    it('should get all products for a customer', async () => {
      user = { role: UserRole.Customer };
      productService.fetchAll = jest.fn().mockResolvedValue([{}]);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.get(user as User, res as Response);
      expect(productService.fetchAll).toHaveBeenCalled();
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should get all products for a supplier', async () => {
      productService.fetchAllByRole = jest.fn().mockResolvedValue([{}]);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.get(user as User, res as Response);
      expect(productService.fetchAllByRole).toHaveBeenCalledWith(user.email);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });
  });

  describe('getById', () => {
    it('should get a product using its id', async () => {
      productService.fetchById = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.getById(
        res as Response,
        productId
      );
      expect(productService.fetchById).toHaveBeenCalledWith(productId);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productService.fetchById = jest.fn().mockResolvedValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.getById(res as Response, productId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.PRODUCT_NOT_EXISTS.message);
      }
    });
  });

  describe('remove', () => {
    it('should remove a product using its id', async () => {
      productService.remove = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await productController.remove(
        user as User,
        res as Response,
        productId
      );
      expect(productService.remove).toHaveBeenCalledWith(productId, user.email);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw ForbiddenException if role is invalid', async () => {
      user = { role: UserRole.Customer };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.remove(
          user as User,
          res as Response,
          productId
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(httpResponses.FORBIDDEN.message);
      }
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productService.remove = jest.fn().mockResolvedValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await productController.remove(
          user as User,
          res as Response,
          productId
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.PRODUCT_NOT_EXISTS.message);
      }
    });
  });
});
