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
  UnprocessableEntityException,
  UseGuards
} from '@nestjs/common';
import { Response } from 'express';
import * as _ from 'lodash';
import { Types } from 'mongoose';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ProductService } from 'src/products/product.service';
import { User, UserRole } from 'src/users/interface/user.interface';
import buildPayloadResponse from 'src/utils/buildResponsePayload';
import handleError from 'src/utils/handleError';
import httpResponses from 'src/utils/responses';
import { OrderDto } from './dto';
import { OrderService } from './order.service';

@UseGuards(JwtGuard)
@Controller('api/v1/orders')
export class OrderController {
  private readonly logger = new Logger();

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Res() res: Response,
    @Body() dto: OrderDto
  ) {
    this.logger.debug(dto, 'Order controller :: create');

    if (dto.products.length > 15) {
      throw new UnprocessableEntityException(
        httpResponses.TOO_MANY_PRODUCTS.message
      );
    }

    if (user.role !== UserRole.Customer) {
      throw new ForbiddenException();
    }

    dto.customer = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      city: user.city,
      address: user.address
    };
    try {
      await Promise.all(
        dto.products.map((product: string) =>
          this.productService.fetchById(new Types.ObjectId(product))
        )
      );
      const order = await this.orderService.create(dto);
      const proctectedOrders = this.protectOrder(order);
      return res.status(HttpStatus.CREATED).json(
        buildPayloadResponse(httpResponses.CREATED, {
          order: proctectedOrders
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
    try {
      const orders = await this.orderService.fetchAllByRole(
        user.role,
        user.email
      );
      const proctectedOrders = orders.map(
        (order: unknown) => (order = this.protectOrder(order))
      );
      return res.status(HttpStatus.OK).json(
        buildPayloadResponse(httpResponses.OK, {
          orders: proctectedOrders
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
    const objectIdOrderId = new Types.ObjectId(orderId);
    try {
      const order = await this.orderService.fetchById(objectIdOrderId);

      if (!order) {
        throw new NotFoundException(httpResponses.ORDER_NOT_EXISTS.message);
      }

      const proctectedOrders = this.protectOrder(order);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { order: proctectedOrders })
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
    const objectIdOrderId = new Types.ObjectId(orderId);
    try {
      const order = await this.orderService.remove(objectIdOrderId, user.email);

      if (!order) {
        throw new NotFoundException(httpResponses.ORDER_NOT_EXISTS.message);
      }

      const proctectedOrders = this.protectOrder(order);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { order: proctectedOrders })
        );
    } catch (error) {
      this.logger.error(error.message, 'Order controller :: remove');
      return handleError(res, error);
    }
  }

  private protectOrder(order: unknown) {
    return _.pick(
      order,
      '_id',
      'orders',
      'customer',
      'transporter',
      'payment',
      'createdAt'
    );
  }
}
