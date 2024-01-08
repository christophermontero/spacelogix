import {
  HttpStatus,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { OrderModel } from '../mockData/order.model.mock';
import { ProductModel } from '../mockData/product.model.mock';
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
      hashedPassword:
        '$2b$10$R0VOrr7DALhGgl8LBeL1iO0UE.pEzl9.r8eg632vi2jYlvp.VU5ci',
      phone: '98765432',
      address: 'Fake St. 123',
      city: 'John Doe City',
      country: 'John Doe Country',
      role: UserRole.Customer
    };
    dto = {
      products: ['659b50aabd8aa10100e284fb']
    };
  });

  describe('create', () => {
    it('should create an order for a customer', async () => {
      productService.fetchById = jest.fn().mockReturnValue({
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
      productService.fetchById = jest.fn().mockReturnValue(null);

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
});
