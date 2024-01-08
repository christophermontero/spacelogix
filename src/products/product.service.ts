import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import httpResponses from '../utils/responses';
import { EditProductDto, ProductDto } from './dto';
import { Product } from './interface/product.interface';

@Injectable()
export class ProductService {
  private readonly logger = new Logger();

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>
  ) {}

  async create(dto: ProductDto) {
    try {
      const product = await new this.productModel(dto);
      await product.save();
      return product;
    } catch (error) {
      this.logger.error(error.message, 'Product service :: create');
      throw error;
    }
  }

  async fetchAllByRole(email: string) {
    try {
      return await this.productModel.find({ 'supplier.email': email });
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getAll');
      throw error;
    }
  }

  async fetchAll() {
    try {
      return await this.productModel.find();
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getAll');
      throw error;
    }
  }

  async fetchById(productId: string) {
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      return await this.productModel.findById(objectIdProductId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getById');
      throw error;
    }
  }

  async update(productId: Types.ObjectId, email: string, dto: EditProductDto) {
    try {
      const product = await this.productModel.findOne({
        _id: productId,
        'supplier.email': email
      });

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      if (dto.name) {
        product.name = dto.name;
      }
      if (dto.description) {
        product.description = dto.description;
      }
      if (dto.price) {
        product.price = dto.price;
      }
      if (dto.currency) {
        product.currency = dto.currency;
      }
      if (dto.stock) {
        product.stock = dto.stock;
      }

      return await product.save();
    } catch (error) {
      this.logger.error(error.message, 'Product service :: update');
      throw error;
    }
  }

  async remove(productId: Types.ObjectId, email: string) {
    try {
      return await this.productModel.findOneAndDelete({
        _id: productId,
        'supplier.email': email
      });
    } catch (error) {
      this.logger.error(error.message, 'Product service :: update');
      throw error;
    }
  }
}
