import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './orders/order.module';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    MongooseModule.forRoot('mongodb://mongodb:27017/spacelogixdb')
  ]
})
export class AppModule {}
