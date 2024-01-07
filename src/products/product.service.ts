import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async fetchAll() {
    try {
      return await this.productModel.find();
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getAll');
      throw error;
    }
  }

  async getById(productId: Types.ObjectId) {
    try {
      return await this.productModel.findById(productId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getById');
      throw error;
    }
  }

  async update(productId: Types.ObjectId, dto: EditProductDto) {
    try {
      return await this.productModel.findByIdAndUpdate(
        productId,
        {
          ...(dto.name && { name: dto.name }),
          ...(dto.description && { name: dto.description }),
          ...(dto.price && { name: dto.price }),
          ...(dto.stock && { name: dto.stock })
        },
        { new: true }
      );
    } catch (error) {
      this.logger.error(error.message, 'Product service :: update');
      throw error;
    }
  }

  async remove(productId: Types.ObjectId) {
    try {
      return await this.productModel.findByIdAndDelete(productId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: update');
      throw error;
    }
  }
}
