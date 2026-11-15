import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List users with pagination, search, role, and status filters' })
  @ApiOkResponse({ description: 'Paginated list of users retrieved' })
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by MongoDB ObjectId' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'User details returned' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user with duplicate email prevention' })
  @ApiCreatedResponse({ description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      data: user,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing user by ID' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'User updated successfully' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.usersService.remove(id);
    return {
      message: 'User deleted successfully',
      data: result,
    };
  }
}
