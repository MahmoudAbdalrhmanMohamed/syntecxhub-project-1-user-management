import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserStatus } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getStats() {
    const [totalUsers, activeUsers, inactiveUsers, suspendedUsers, allUsers, recentUsers] =
      await Promise.all([
        this.userModel.countDocuments().exec(),
        this.userModel.countDocuments({ status: UserStatus.ACTIVE }).exec(),
        this.userModel.countDocuments({ status: UserStatus.INACTIVE }).exec(),
        this.userModel.countDocuments({ status: UserStatus.SUSPENDED }).exec(),
        this.userModel.find().select('role status department').exec(),
        this.userModel.find().sort({ createdAt: -1 }).limit(6).exec(),
      ]);

    const roleMap = new Map<string, number>();
    const deptMap = new Map<string, number>();
    for (const u of allUsers) {
      roleMap.set(u.role, (roleMap.get(u.role) || 0) + 1);
      const dept = u.department || 'Operations';
      deptMap.set(dept, (deptMap.get(dept) || 0) + 1);
    }

    return {
      summary: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        suspendedUsers,
        totalDepartments: deptMap.size,
      },
      distributions: {
        usersByRole: Array.from(roleMap.entries()).map(([role, count]) => ({ role, count })),
        usersByDepartment: Array.from(deptMap.entries()).map(([department, count]) => ({
          department,
          count,
        })),
      },
      recent: {
        users: recentUsers,
      },
    };
  }

  async getActivity() {
    const recentUsers = await this.userModel.find().sort({ createdAt: -1 }).limit(8).exec();
    const events = recentUsers.map((u) => ({
      id: `user-${String(u._id)}`,
      type: 'user_registered' as const,
      title: `Team member registered: ${u.fullName}`,
      subtitle: `${u.role.toUpperCase()} • ${u.department || 'Operations'} (${u.email})`,
      timestamp: (u.createdAt || new Date()).toISOString(),
      actor: u.fullName,
    }));
    return { events, totalEvents: events.length };
  }
}
