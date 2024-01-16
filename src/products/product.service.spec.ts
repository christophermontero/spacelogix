import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { UserRole } from '../users/interface/user.interface';
import httpResponses from '../utils/responses';
import { EditProductDto, ProductDto } from './dto';
import { Currency } from './interface/product.interface';
import { ProductService } from './product.service';

class MockProductModel {
  constructor(private readonly data: any) {}
  static create(data: any): MockProductModel {
    return new MockProductModel(data);
  }
  static find(criteria: any): MockProductModel[] {
    return [new MockProductModel({})];
  }
  static findById(objectId: Types.ObjectId): MockProductModel {
    return new MockProductModel({});
  }
  static findByIdAndDelete(objectId: Types.ObjectId): MockProductModel {
    return new MockProductModel({});
  }
  static findOne(ele: { [key: string]: string }): MockProductModel {
    return new MockProductModel({});
  }
  async save(): Promise<MockProductModel> {
    return this;
  }
}

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken('Product'),
          useValue: MockProductModel
        }
      ]
    }).compile();
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('create', () => {
    let productDto: Partial<ProductDto>;

    beforeEach(() => {
      productDto = {};
    });

    it('should create a new product', async () => {
      const saveSpy = jest.spyOn(MockProductModel.prototype, 'save');
      await productService.create(productDto as ProductDto);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is saving the product', async () => {
      const mockError = new Error('Saving product error');
      jest
        .spyOn(MockProductModel.prototype, 'save')
        .mockRejectedValue(mockError);
      await expect(
        productService.create(productDto as ProductDto)
      ).rejects.toThrow(mockError);
    });
  });

  describe('fetchAllByRole', () => {
    let role: UserRole;
    let email: string;

    it('should fetch products for a supplier role', async () => {
      role = UserRole.Supplier;
      email = 'supplier@example.com';
      const findSpy = jest.spyOn(MockProductModel, 'find');
      const result = await productService.fetchAllByRole(email);
      expect(result).toEqual([new MockProductModel({})]);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is fetching products', async () => {
      role = UserRole.Customer;
      const mockError = new Error('Fetching products error');
      jest
        .spyOn(MockProductModel, 'find')
        .mockRejectedValue(mockError as never);
      await expect(productService.fetchAllByRole(email)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('fetchAll', () => {
    it('should fetch products', async () => {
      const findSpy = jest.spyOn(MockProductModel, 'find');
      await productService.fetchAll();
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is fetching products', async () => {
      const mockError = new Error('Fetching products error');
      jest
        .spyOn(MockProductModel, 'find')
        .mockRejectedValue(mockError as never);
      await expect(productService.fetchAll()).rejects.toThrow(mockError);
    });
  });

  describe('update', () => {
    let productId: string;
    let productDto: Partial<EditProductDto>;

    beforeAll(() => {
      productId = '65a02b84d4c97df504ad5eee';
      productDto = {
        name: 'new product',
        description: 'new description',
        price: 1,
        currency: Currency.USD,
        stock: 1
      };
    });

    it('should update a product', async () => {
      const findSpy = jest
        .spyOn(MockProductModel, 'findById')
        .mockResolvedValue(new MockProductModel({}) as never);
      const saveSpy = jest.spyOn(MockProductModel.prototype, 'save');
      await productService.update(productId, productDto as EditProductDto);
      expect(findSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when product does not exist', async () => {
      jest.spyOn(MockProductModel, 'findById');
      await expect(
        productService.update(productId, productDto as EditProductDto)
      ).rejects.toThrow(
        new NotFoundException(httpResponses.PRODUCT_NOT_EXISTS.message)
      );
    });

    it('should throw an error when is updating the product', async () => {
      jest
        .spyOn(MockProductModel, 'findById')
        .mockResolvedValue(new MockProductModel({}) as never);
      const mockError = new Error('Updating product error');
      jest
        .spyOn(MockProductModel.prototype, 'save')
        .mockRejectedValue(mockError);
      await expect(
        productService.update(productId, productDto as EditProductDto)
      ).rejects.toThrow(mockError);
    });
  });

  describe('fetchById', () => {
    let orderId: string;

    it('should fetch product using its id', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const findSpy = jest
        .spyOn(MockProductModel, 'findById')
        .mockResolvedValue(new MockProductModel({}) as never);
      const result = await productService.fetchById(orderId);
      expect(result).toEqual(new MockProductModel({}));
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is fetching product using its id', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const mockError = new Error('Fetching product error');
      jest
        .spyOn(MockProductModel, 'findById')
        .mockRejectedValue(mockError as never);
      await expect(productService.fetchById(orderId)).rejects.toThrow(
        mockError
      );
    });
  });

  describe('fetchByName', () => {
    let name: string;

    beforeAll(() => {
      name = 'product 1';
    });

    it('should fetch product by name', async () => {
      const findSpy = jest.spyOn(MockProductModel, 'findOne');
      await productService.fetchByName(name);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is fetching product using its name', async () => {
      const mockError = new Error('Fetching product error');
      jest
        .spyOn(MockProductModel, 'findOne')
        .mockRejectedValue(mockError as never);
      await expect(productService.fetchByName(name)).rejects.toThrow(mockError);
    });
  });

  describe('remove', () => {
    let orderId: string;

    it('should remove product using its id', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const deleteSpy = jest.spyOn(MockProductModel, 'findByIdAndDelete');
      const result = await productService.remove(orderId);
      expect(result).toEqual(new MockProductModel({}));
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is deleting product', async () => {
      orderId = '65a02b84d4c97df504ad5eee';
      const mockError = new Error('Deleting product error');
      jest
        .spyOn(MockProductModel, 'findByIdAndDelete')
        .mockRejectedValue(mockError as never);
      await expect(productService.remove(orderId)).rejects.toThrow(mockError);
    });
  });
});
