import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JWTAuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { QueryBlogDto } from './dto/query-blog.dto';
import { CursorQueryBlogDto } from './dto/cursor-query-blog.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Tạo blog mới' })
  @ApiResponse({ status: 201, description: 'Tạo blog thành công' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  create(
    @CurrentUser('sub') userId: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.create(createBlogDto, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Lấy danh sách blog của tôi (phân trang offset)' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findMine(@CurrentUser('sub') userId: string, @Query() query: QueryBlogDto) {
    return this.blogService.findMine(+userId, query);
  }

  @Get('public')
  @ApiOperation({ summary: 'Danh sách blog công khai (v1, phân trang offset)' })
  findAllPublic(@Query() query: QueryBlogDto) {
    return this.blogService.findAllPublic(query);
  }

  @Get('public')
  @Version('2')
  @ApiOperation({ summary: 'Danh sách blog công khai (v2, phân trang cursor)' })
  findAllPublicWithCursor(@Query() query: CursorQueryBlogDto) {
    return this.blogService.findAllPublicWithCursor(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một blog' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của blog' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy blog' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Cập nhật blog (chỉ chủ sở hữu)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của blog' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy blog' })
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(+id, updateBlogDto, +userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa blog' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của blog' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy blog' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
