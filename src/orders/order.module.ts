import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from '../products/product.service';
import ProductSchema from '../products/schema/product.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import OrderSchema from './schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Order', schema: OrderSchema },
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [OrderController],
  providers: [OrderService, ProductService]
})
export class OrderModule {}
