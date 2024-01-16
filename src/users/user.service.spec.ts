import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

class MockUserModel {
  constructor(private readonly data: any) {}
  static findByIdAndUpdate(criteria: any): MockUserModel[] {
    return [new MockUserModel({})];
  }
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: MockUserModel
        }
      ]
    }).compile();
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('update', () => {
    let userId: string;
    let userDto: Partial<EditUserDto>;

    beforeAll(() => {
      userId = '65a02b84d4c97df504ad5eee';
      userDto = {
        email: 'newsupplier@mailinator.com',
        name: 'new supplier',
        phone: '98765432',
        country: 'new supplier country',
        city: 'new supplier city',
        address: 'fake st. 123'
      };
    });

    it('should update a user', async () => {
      const findSpy = jest.spyOn(MockUserModel, 'findByIdAndUpdate');
      await userService.update(userId, userDto as EditUserDto);
      expect(findSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error when is updating the user', async () => {
      const mockError = new Error('Updating user error');
      jest
        .spyOn(MockUserModel, 'findByIdAndUpdate')
        .mockRejectedValue(mockError as never);
      await expect(
        userService.update(userId, userDto as EditUserDto)
      ).rejects.toThrow(mockError);
    });
  });
});
