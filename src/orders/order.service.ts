import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/products/interface/product.interface';
import { OrderDto, ProductOrderDto } from './dto';
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
      const products = await Promise.all(
        dto.products.map((prod: ProductOrderDto) =>
          this.productModel.findById(prod.id)
        )
      );
      const order = await new this.orderModel(dto);
      await order.save();
      return order;
    } catch (error) {
      this.logger.error(error.message, 'Product service :: create');
      throw error;
    }
  }

  async fetchAllByRole(email: string) {
    try {
      return await this.orderModel.find({ 'supplier.email': email });
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getAll');
      throw error;
    }
  }

  async fetchAll() {
    try {
      return await this.orderModel.find();
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getAll');
      throw error;
    }
  }

  async fetchById(productId: Types.ObjectId) {
    try {
      return await this.orderModel.findById(productId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getById');
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
      this.logger.error(error.message, 'Product service :: update');
      throw error;
    }
  }
}
