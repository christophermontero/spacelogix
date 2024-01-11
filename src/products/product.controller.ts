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
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User, UserRole } from '../users/interface/user.interface';
import buildPayloadResponse from '../utils/buildResponsePayload';
import handleError from '../utils/handleError';
import httpResponses from '../utils/responses';
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
      throw new ForbiddenException(httpResponses.FORBIDDEN.message);
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
      return res
        .status(HttpStatus.CREATED)
        .json(
          buildPayloadResponse(httpResponses.CREATED, { produId: product._id })
        );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: create');
      return handleError(res, error);
    }
  }

  @Get()
  async get(@GetUser() user: User, @Res() res: Response) {
    this.logger.debug('Product controller :: get');
    let products;
    try {
      if (user.role === UserRole.Customer) {
        products = await this.productService.fetchAll();
      } else {
        products = await this.productService.fetchAllByRole(user.email);
      }
      const proctectedProduct = products.map(
        (prod) => (prod = this.protectProduct(prod))
      );
      return res.status(HttpStatus.OK).json(
        buildPayloadResponse(httpResponses.OK, {
          products: proctectedProduct
        })
      );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: get');
      return handleError(res, error);
    }
  }

  @Get(':productId')
  async getById(@Res() res: Response, @Param('productId') productId: string) {
    this.logger.debug('Product controller :: getById');
    try {
      const product = await this.productService.fetchById(productId);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      const proctectedProduct = this.protectProduct(product);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { product: proctectedProduct })
        );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: getById');
      return handleError(res, error);
    }
  }

  @Patch(':productId')
  async update(
    @GetUser() user: User,
    @Res() res: Response,
    @Param('productId') productId: string,
    @Body() dto: EditProductDto
  ) {
    this.logger.debug('Product controller :: update');
    if (user.role !== UserRole.Supplier) {
      throw new ForbiddenException(httpResponses.FORBIDDEN.message);
    }
    try {
      const product = await this.productService.update(productId, dto);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      const proctectedProduct = this.protectProduct(product);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { product: proctectedProduct })
        );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: update');
      return handleError(res, error);
    }
  }

  @Delete(':productId')
  async remove(
    @GetUser() user: User,
    @Res() res: Response,
    @Param('productId') productId: string
  ) {
    this.logger.debug('Product controller :: remove');
    if (user.role !== UserRole.Supplier) {
      throw new ForbiddenException(httpResponses.FORBIDDEN.message);
    }
    try {
      const product = await this.productService.remove(productId, user.email);

      if (!product) {
        throw new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message);
      }

      const proctectedProduct = this.protectProduct(product);
      return res
        .status(HttpStatus.OK)
        .json(
          buildPayloadResponse(httpResponses.OK, { product: proctectedProduct })
        );
    } catch (error) {
      this.logger.error(error.message, 'Product controller :: remove');
      return handleError(res, error);
    }
  }

  private protectProduct(product: unknown) {
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
