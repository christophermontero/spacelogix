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
import { OrderDto } from './dto';
import { OrderService } from './order.service';

@UseGuards(JwtGuard)
@Controller('api/v1/products')
export class OrderController {
  private readonly logger = new Logger();

  constructor(private orderService: OrderService) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Res() res: Response,
    @Body() dto: OrderDto
  ) {
    this.logger.debug(dto, 'Order controller :: create');
    if (user.role !== UserRole.Customer) {
      throw new ForbiddenException();
    }
    try {
      const product = await this.orderService.create(dto);
      const proctectedProduct = this.protectOrder(product);
      return res.status(HttpStatus.CREATED).json(
        buildPayloadResponse(httpResponses.CREATED, {
          product: proctectedProduct
        })
      );
    } catch (error) {
      this.logger.error(error.message, 'Order controller :: create');
      return handleError(res, error);
    }
  }

  @Get()
  async get(@GetUser() user: User, @Res() res: Response) {
    this.logger.debug('Order controller :: get');
    let products;
    try {
      if (user.role === UserRole.Customer) {
        products = await this.orderService.fetchAll();
      } else {
        products = await this.orderService.fetchAllByRole(user.email);
      }
      const proctectedProduct = products.map(
        (prod) => (prod = this.protectOrder(prod))
      );
      return res.status(HttpStatus.OK).json(
        buildPayloadResponse(httpResponses.OK, {
          products: proctectedProduct
        })
      );
    } catch (error) {
      this.logger.error(error.message, 'Order controller :: get');
      return handleError(res, error);
    }
  }

  @Get(':orderId')
  async getById(@Res() res: Response, @Param('orderId') orderId: string) {
    this.logger.debug('Order controller :: getById');
    const objectIdProductId = new Types.ObjectId(orderId);
    try {
      const product = await this.orderService.fetchById(objectIdProductId);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      const proctectedProduct = this.protectOrder(product);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { product: proctectedProduct })
        );
    } catch (error) {
      this.logger.error(error.message, 'Order controller :: getById');
      return handleError(res, error);
    }
  }

  @Delete(':orderId')
  async remove(
    @GetUser() user: User,
    @Res() res: Response,
    @Param('orderId') orderId: string
  ) {
    this.logger.debug('Order controller :: remove');
    if (user.role !== UserRole.Customer) {
      throw new ForbiddenException();
    }
    const objectIdProductId = new Types.ObjectId(orderId);
    try {
      const product = await this.orderService.remove(
        objectIdProductId,
        user.email
      );

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      const proctectedProduct = this.protectOrder(product);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { product: proctectedProduct })
        );
    } catch (error) {
      this.logger.error(error.message, 'Order controller :: remove');
      return handleError(res, error);
    }
  }

  private protectOrder(product: unknown) {
    return _.pick(
      product,
      '_id',
      'name',
      'description',
      'price',
      'currency',
      'stock',
      'supplier'
    );
  }
}
