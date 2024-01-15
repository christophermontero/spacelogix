import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
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
    this.logger.debug(dto, 'Product service :: create');
    try {
      const product = await new this.productModel(dto);
      await product.save();
      return product;
    } catch (error) {
      this.logger.error(error.message, 'Product service :: create');
      if (error.code === 11000) {
        throw new ConflictException(httpResponses.PRODUCT_EXISTS.message);
      }
      throw error;
    }
  }

  async fetchAllByRole(email: string) {
    this.logger.debug(email, 'Product service :: fetchAllByRole');
    try {
      return await this.productModel.find({ 'supplier.email': email });
    } catch (error) {
      this.logger.error(error.message, 'Product service :: fetchAllByRole');
      throw error;
    }
  }

  async fetchAll() {
    this.logger.debug('Product service :: fetchAll');
    try {
      return await this.productModel.find();
    } catch (error) {
      this.logger.error(error.message, 'Product service :: fetchAll');
      throw error;
    }
  }

  async fetchById(productId: string) {
    this.logger.debug(productId, 'Product service :: fetchById');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      return await this.productModel.findById(objectIdProductId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: getById');
      throw error;
    }
  }

  async fetchByName(prodName: string) {
    this.logger.debug(prodName, 'Product service :: fetchByName');
    try {
      return await this.productModel.findOne({ name: prodName });
    } catch (error) {
      this.logger.error(error.message, 'Product service :: fetchByName');
      throw error;
    }
  }

  async update(productId: string, dto: EditProductDto) {
    this.logger.debug({ productId, dto }, 'Product service :: update');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      const product = await this.productModel.findById(objectIdProductId);

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

  async remove(productId: string) {
    this.logger.debug({ productId }, 'Product service :: remove');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      return await this.productModel.findByIdAndDelete(objectIdProductId);
    } catch (error) {
      this.logger.error(error.message, 'Product service :: remove');
      throw error;
    }
  }
}
