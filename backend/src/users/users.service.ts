import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { escapeRegExp } from '../common/utils/regex.util';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(query: QueryUsersDto): Promise<PaginatedResult<UserDocument>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<UserDocument> = {};

    if (query.search && query.search.trim()) {
      const safeRegex = new RegExp(escapeRegExp(query.search.trim()), 'i');
      filter.$or = [
        { fullName: safeRegex },
        { email: safeRegex },
        { phoneNumber: safeRegex },
        { department: safeRegex },
        { jobTitle: safeRegex },
      ];
    }

    if (query.role) {
      filter.role = query.role;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.department && query.department.trim()) {
      filter.department = new RegExp(escapeRegExp(query.department.trim()), 'i');
    }

    const allowedSortFields = ['createdAt', 'updatedAt', 'fullName', 'email', 'role', 'status'];
    const sortField = allowedSortFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();
    const existing = await this.userModel
      .findOne({ email: normalizedEmail })
      .exec();

    if (existing) {
      throw new ConflictException(
        `A user with email "${normalizedEmail}" already exists.`,
      );
    }

    const defaultAvatar =
      createUserDto.avatar && createUserDto.avatar.trim()
        ? createUserDto.avatar.trim()
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            createUserDto.fullName,
          )}&background=0F172A&color=F8FAFC&bold=true`;

    const created = new this.userModel({
      ...createUserDto,
      email: normalizedEmail,
      avatar: defaultAvatar,
      department: createUserDto.department || 'Operations',
      jobTitle: createUserDto.jobTitle || 'Specialist',
      lastActiveAt: new Date(),
    });

    return created.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const existingUser = await this.findOne(id);

    if (updateUserDto.email) {
      const normalizedEmail = updateUserDto.email.trim().toLowerCase();
      if (normalizedEmail !== existingUser.email) {
        const emailTaken = await this.userModel
          .findOne({ email: normalizedEmail, _id: { $ne: id } })
          .exec();
        if (emailTaken) {
          throw new ConflictException(
            `Another user is already registered with email "${normalizedEmail}".`,
          );
        }
      }
      updateUserDto.email = normalizedEmail;
    }

    const updated = await this.userModel
      .findByIdAndUpdate(
        id,
        { $set: { ...updateUserDto, lastActiveAt: new Date() } },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`User with ID "${id}" was not found.`);
    }

    return updated;
  }

  async remove(id: string): Promise<{ deletedId: string; email: string }> {
    const existing = await this.findOne(id);
    await this.userModel.findByIdAndDelete(id).exec();
    return {
      deletedId: String(existing._id),
      email: existing.email,
    };
  }
}
