import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User, UserRole } from 'src/users/interface/user.interface';
import buildPayloadResponse from 'src/utils/buildResponsePayload';
import handleError from 'src/utils/handleError';
import httpResponses from 'src/utils/responses';
import { EditProductDto, ProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('api/v1/products')
export class ProductController {
  private readonly logger = new Logger();

  constructor(private productService: ProductService) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Res() res: Response,
    @Body() dto: ProductDto
  ) {
    this.logger.debug(dto, 'Product controller :: create');
    if (user.role !== UserRole.Supplier) {
      throw new ForbiddenException();
    }
    try {
      dto = {
        ...dto,
        supplier: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          country: user.country,
          city: user.city,
          address: user.address
        }
      };
      const product = await this.productService.create(dto);
      const proctectedProduct = _.pick(product, [
        '_id',
        'name',
        'descriptioin',
        'price',
        'stock',
        'supplier'
      ]);
      return res.status(HttpStatus.CREATED).json(
        buildPayloadResponse(httpResponses.CREATED, {
          product: proctectedProduct
        })
      );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: create');
      return handleError(res, error);
    }
  }

  @Get()
  async fetchAll(@Res() res: Response) {
    this.logger.debug('Product controller :: fetchAll');
    try {
      const products = await this.productService.fetchAll();
      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, products));
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: fetchAll');
      return handleError(res, error);
    }
  }

  @Get(':productId')
  async getById(@Res() res: Response, @Param('productId') productId: string) {
    this.logger.debug('Product controller :: getById');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      const product = await this.productService.getById(objectIdProductId);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, product));
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: getById');
      return handleError(res, error);
    }
  }

  @Patch(':productId')
  async update(
    @Res() res: Response,
    @Param('productId') productId: string,
    @Body() dto: EditProductDto
  ) {
    this.logger.debug('Product controller :: update');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      const product = await this.productService.update(objectIdProductId, dto);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, product));
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: remove');
      return handleError(res, error);
    }
  }

  @Delete(':productId')
  async remove(@Res() res: Response, @Param('productId') productId: string) {
    this.logger.debug('Product controller :: remove');
    const objectIdProductId = new Types.ObjectId(productId);
    try {
      const product = await this.productService.remove(objectIdProductId);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      return res
        .status(HttpStatus.OK)
        .json(buildPayloadResponse(httpResponses.OK, product));
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: remove');
      return handleError(res, error);
    }
  }
}
