import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from '../products/interface/product.interface';
import { UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { OrderDto } from './dto';
import { Order } from './interface/order.interface';

@Injectable()
export class OrderService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('Product') private readonly productModel: Model<Product>
  ) {}

  async create(dto: OrderDto) {
    this.logger.debug(dto, 'Order service :: create');
    try {
      const order = await new this.orderModel(dto);
      await order.save();
      return order;
    } catch (error) {
      this.logger.error(error.message, 'Order service :: create');
      throw error;
    }
  }

  async fetchAllByRole(role: string, email: string) {
    this.logger.debug({ role, email }, 'Order service :: fetchAllByRole');
    let criteria;
    if (role === UserRole.Customer) {
      criteria = { 'customer.email': email };
    } else if (role === UserRole.Transporter) {
      criteria = { 'transporter.email': email };
    }

    if (!criteria) {
      throw new ForbiddenException(httpResponses.FORBIDDEN.message);
    }
    try {
      return await this.orderModel
        .find(criteria)
        .populate(
          'products',
          '_id name description price currency stock supplier'
        );
    } catch (error) {
      this.logger.error(error.message, 'Order service :: fetchAllByRole');
      throw error;
    }
  }

  async fetchById(orderId: string) {
    this.logger.debug(orderId, 'Order service :: fetchById');
    const objectIdOrderId = new Types.ObjectId(orderId);
    try {
      return await this.orderModel
        .findById(objectIdOrderId)
        .populate(
          'products',
          '_id name description price currency stock supplier'
        );
    } catch (error) {
      this.logger.error(error.message, 'Order service :: fetchById');
      throw error;
    }
  }

  async remove(orderId: string, email: string) {
    this.logger.debug({ orderId, email }, 'Order service :: remove');
    const objectIdOrderId = new Types.ObjectId(orderId);
    try {
      return await this.orderModel.findOneAndDelete({
        _id: objectIdOrderId,
        'customer.email': email
      });
    } catch (error) {
      this.logger.error(error.message, 'Order service :: remove');
      throw error;
    }
  }
}
