import { ConflictException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole, UserStatus } from './schemas/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: '673700000000000000000001',
    fullName: 'Mahmoud Abdalrahman',
    email: 'mahmoud.abdalrahman@syntecxhub.io',
    phoneNumber: '+20 100 512 8400',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Platform Architecture',
    jobTitle: 'Principal Full-Stack Architect',
  };

  const mockUserModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    _id: '673700000000000000000099',
    save: jest.fn().mockResolvedValue({
      _id: '673700000000000000000099',
      ...dto,
    }),
  }));

  mockUserModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockUser]),
        }),
      }),
    }),
  });
  mockUserModel.countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(1),
  });
  mockUserModel.findById = jest.fn();
  mockUserModel.findOne = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.findByIdAndDelete = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('returns paginated users with metadata', async () => {
    const result = await service.findAll({
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    expect(result.items).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('prevents duplicate email registration with ConflictException', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    await expect(
      service.create({
        fullName: 'Duplicate User',
        email: 'mahmoud.abdalrahman@syntecxhub.io',
        phoneNumber: '+20 100 000 0000',
        role: UserRole.VIEWER,
        status: UserStatus.ACTIVE,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('throws NotFoundException when user ID does not exist', async () => {
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(
      service.findOne('673700000000000000000404'),
    ).rejects.toThrow(NotFoundException);
  });
});
