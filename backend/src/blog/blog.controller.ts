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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JWTAuthGuard } from 'src/auth/guard/auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { QueryBlogDto } from './dto/query-blog.dto';
import { CursorQueryBlogDto } from './dto/cursor-query-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() createBlogDto: CreateBlogDto,
  ) {
    return this.blogService.create(createBlogDto, userId);
  }

  @UseGuards(JWTAuthGuard)
  @Get('me')
  findMine(@CurrentUser('sub') userId: string, @Query() query: QueryBlogDto) {
    return this.blogService.findMine(+userId, query);
  }

  @Get('public')
  findAllPublic(@Query() query: QueryBlogDto) {
    return this.blogService.findAllPublic(query);
  }

  @Get('public')
  @Version('2')
  findAllPublicWithCursor(@Query() query: CursorQueryBlogDto) {
    return this.blogService.findAllPublicWithCursor(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  update(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(+id, updateBlogDto, +userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
