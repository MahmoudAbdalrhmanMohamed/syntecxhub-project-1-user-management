import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/schemas/user.schema';
import { DashboardService } from './dashboard.service';

describe('DashboardService (Project 1 - Users)', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const mockUsers = [
      {
        _id: '673700000000000000000001',
        fullName: 'Mahmoud Abdalrahman',
        email: 'mahmoud.abdalrahman@aegisauth.io',
        role: 'admin',
        status: 'active',
        department: 'Platform Architecture',
        createdAt: new Date(),
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(User.name),
          useValue: {
            countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
            find: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUsers) }),
              sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUsers) }),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('returns user directory summary metrics and role distributions', async () => {
    const stats = await service.getStats();
    expect(stats.summary.totalUsers).toBe(1);
    expect(stats.distributions.usersByRole[0].role).toBe('admin');
  });
});
