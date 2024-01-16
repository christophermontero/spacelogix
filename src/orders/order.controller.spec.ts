import {
  ForbiddenException,
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { OrderModel } from '../../test/mockData/order.model.mock';
import { ProductModel } from '../../test/mockData/product.model.mock';
import { Currency } from '../products/interface/product.interface';
import { ProductService } from '../products/product.service';
import { User, UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { OrderDto } from './dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;
  let productService: ProductService;
  let user: Partial<User>;
  let dto: Partial<OrderDto>;
  let orderId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        ProductService,
        {
          provide: 'OrderModel',
          useValue: OrderModel
        },
        {
          provide: 'ProductModel',
          useValue: ProductModel
        }
      ]
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
    productService = module.get<ProductService>(ProductService);
    user = {
      name: 'John Doe',
      email: 'johndoe@mailinator.com',
      phone: '98765432',
      address: 'Fake St. 123',
      city: 'John Doe City',
      country: 'John Doe Country',
      role: UserRole.Customer
    };
    dto = {
      products: [
        {
          name: 'product 3',
          description: 'description 3',
          price: 1000,
          currency: Currency.USD,
          quantity: 1,
          supplier: {
            name: 'supplier2',
            email: 'supplier2@mailinator.com',
            phone: '98765432',
            address: 'fake st. 123',
            city: 'supplier2 city',
            country: 'supplier2 country'
          }
        }
      ]
    };
    orderId = 'orderId';
  });

  describe('create', () => {
    it('should create an order for a customer', async () => {
      productService.fetchByName = jest.fn().mockReturnValue({
        name: 'Product 1',
        description: 'Description 1',
        price: 1000,
        currency: 'usd',
        stock: 100,
        supplier: {
          name: 'Supplier1',
          email: 'supplier1@mailinator.com',
          phone: '98765432',
          address: 'Fake St. 123',
          city: 'Supplier1 City',
          country: 'Supplier1 Country'
        }
      });
      productService.update = jest.fn().mockReturnValue({});
      orderService.create = jest.fn();
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await orderController.create(
        user as User,
        res as Response,
        dto as OrderDto
      );
      expect(orderService.create).toHaveBeenCalledWith(dto);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.CREATED);
    });

    it('should throw ForbiddenException if role is invalid', async () => {
      user = { role: UserRole.Supplier };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.create(
          user as User,
          res as Response,
          dto as OrderDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(httpResponses.FORBIDDEN.message);
      }
    });

    it('should throw UnprocessableEntityException if too many products are provided', async () => {
      dto = {
        products: new Array(16).fill('productId')
      };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.create(
          user as User,
          res as Response,
          dto as OrderDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnprocessableEntityException);
        expect(error.message).toBe(httpResponses.TOO_MANY_PRODUCTS.message);
      }
    });

    it('should throw NotFoundException if some products are missing', async () => {
      productService.fetchByName = jest.fn().mockReturnValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.create(
          user as User,
          res as Response,
          dto as OrderDto
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.MISSING_PRODUCTS.message);
      }
    });
  });

  describe('get', () => {
    it('should get all orders for a customer', async () => {
      orderService.fetchAllByRole = jest.fn().mockResolvedValue([{}]);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await orderController.get(user as User, res as Response);
      expect(orderService.fetchAllByRole).toHaveBeenCalledWith(
        user.role,
        user.email
      );
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw an error when is fetching all orders for a customer', async () => {
      const mockError = new Error('Fetching user error');
      orderService.fetchAllByRole = jest.fn().mockRejectedValue(mockError);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await orderController.get(user as User, res as Response);
      expect(orderService.fetchAllByRole).toHaveBeenCalledWith(
        user.role,
        user.email
      );
      expect(result.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    });
  });

  describe('getById', () => {
    it('should get an order using its id', async () => {
      orderService.fetchById = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await orderController.getById(res as Response, orderId);
      expect(orderService.fetchById).toHaveBeenCalledWith(orderId);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw NotFoundException if order does not exist', async () => {
      orderService.fetchById = jest.fn().mockResolvedValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.getById(res as Response, orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.ORDER_NOT_EXISTS.message);
      }
    });
  });

  describe('remove', () => {
    it('should remove an order for a customer', async () => {
      orderService.remove = jest.fn().mockResolvedValue({});
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      const result = await orderController.remove(
        user as User,
        res as Response,
        orderId
      );
      expect(orderService.remove).toHaveBeenCalledWith(orderId);
      expect(result.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should throw ForbiddenException if role is invalid', async () => {
      user = { role: UserRole.Supplier };
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.remove(user as User, res as Response, orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe(httpResponses.FORBIDDEN.message);
      }
    });

    it('should throw NotFoundException if order does not exist', async () => {
      orderService.remove = jest.fn().mockResolvedValue(null);
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };
      try {
        await orderController.remove(user as User, res as Response, orderId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(httpResponses.ORDER_NOT_EXISTS.message);
      }
    });
  });
});
