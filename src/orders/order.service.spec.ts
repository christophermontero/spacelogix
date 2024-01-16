import { ForbiddenException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { OrderDto } from './dto';
import { OrderService } from './order.service';

class MockOrderModel {
  constructor(private readonly data: any) {}
  static create(data: any): MockOrderModel {
    return new MockOrderModel(data);
  }
  static find(criteria: any): MockOrderModel[] {
    return [new MockOrderModel({})];
  }
  static findById(objectIdOrderId: Types.ObjectId): MockOrderModel {
    return new MockOrderModel({});
  }
  static findByIdAndDelete(objectIdOrderId: Types.ObjectId): MockOrderModel {
    return new MockOrderModel({});
  }
  async save(): Promise<MockOrderModel> {
    return this;
  }
}

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getModelToken('Order'),
          useValue: MockOrderModel
        }
      ]
    }).compile();
    orderService = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    let orderDto: Partial<OrderDto>;

    beforeEach(() => {
      orderDto = {};
    });

    it('should create a new order', async () => {
      const saveSpy = jest.spyOn(MockOrderModel.prototype, 'save');
      await orderService.create(orderDto as OrderDto);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is saving the order', async () => {
      const mockError = new Error('Saving product error');
      jest.spyOn(MockOrderModel.prototype, 'save').mockRejectedValue(mockError);
      await expect(orderService.create(orderDto as OrderDto)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('fetchAllByRole', () => {
    let role: UserRole;
    let email: string;

    it('should fetch orders for a customer role', async () => {
      role = UserRole.Customer;
      email = 'customer@example.com';
      const findSpy = jest.spyOn(MockOrderModel, 'find');
      await orderService.fetchAllByRole(role, email);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should fetch orders for a transporter role', async () => {
      role = UserRole.Transporter;
      email = 'transporter@example.com';
      const findSpy = jest
        .spyOn(MockOrderModel, 'find')
        .mockResolvedValue([new MockOrderModel({})] as never);
      await orderService.fetchAllByRole(role, email);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException for an unknown role', async () => {
      role = null;
      email = 'unknown@example.com';
      await expect(orderService.fetchAllByRole(role, email)).rejects.toThrow(
        new ForbiddenException(httpResponses.FORBIDDEN.message)
      );
    });

    it('should throw an error when is fetching orders', async () => {
      role = UserRole.Customer;
      const mockError = new Error('Fetching orders error');
      jest.spyOn(MockOrderModel, 'find').mockRejectedValue(mockError as never);
      await expect(orderService.fetchAllByRole(role, email)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('fetchById', () => {
    let orderId: string;

    it('should fetch order using its id', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const findSpy = jest.spyOn(MockOrderModel, 'findById');
      await orderService.fetchById(orderId);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is fetching order', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const mockError = new Error('Fetching order error');
      jest
        .spyOn(MockOrderModel, 'findById')
        .mockRejectedValue(mockError as never);
      await expect(orderService.fetchById(orderId)).rejects.toThrow(mockError);
    });
  });

  describe('remove', () => {
    let orderId: string;

    it('should remove order using its id', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const deleteSpy = jest.spyOn(MockOrderModel, 'findByIdAndDelete');
      await orderService.remove(orderId);
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is deleting order', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const mockError = new Error('Deleting order error');
      jest
        .spyOn(MockOrderModel, 'findByIdAndDelete')
        .mockRejectedValue(mockError as never);
      await expect(orderService.remove(orderId)).rejects.toThrow(mockError);
    });
  });
});
