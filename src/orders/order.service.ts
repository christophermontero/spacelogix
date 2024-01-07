import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/products/interface/product.interface';
import { UserRole } from 'src/users/interface/user.interface';
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
    let criteria;
    if (role === UserRole.Customer) {
      criteria = { 'customer.email': email };
    } else if (role === UserRole.Transporter) {
      criteria = { 'transporter.email': email };
    }
    try {
      return await this.orderModel.find(criteria);
    } catch (error) {
      this.logger.error(error.message, 'Order service :: getAll');
      throw error;
    }
  }

  async fetchById(orderId: Types.ObjectId) {
    try {
      return await this.orderModel.findById(orderId);
    } catch (error) {
      this.logger.error(error.message, 'Order service :: getById');
      throw error;
    }
  }

  async remove(orderId: Types.ObjectId, email: string) {
    try {
      return await this.orderModel.findOneAndDelete({
        _id: orderId,
        'customer.email': email
      });
    } catch (error) {
      this.logger.error(error.message, 'Order service :: update');
      throw error;
    }
  }
}
