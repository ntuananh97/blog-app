import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  Get,
  Patch,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JWTAuthGuard } from 'src/auth/guard/auth.guard';
import { GetBlogCommentsDto } from './dto/get-blog-comment-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCursorBlogCommentsDto } from './dto/get-blog-comment-cursor-query.dto';

@ApiTags('Comment')
@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('blog/:blogId/comment')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Bình luận vào blog (trả lời bằng cách truyền parentId)',
  })
  @ApiParam({ name: 'blogId', type: Number, description: 'ID của blog' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  createBlogComment(
    @CurrentUser('sub') userId: number,
    @Param('blogId') blogId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create({
      userId,
      blogId,
      ...createCommentDto,
    });
  }

  @Get('blog/:blogId/comment')
  @ApiOperation({
    summary: 'Danh sách bình luận của blog (v1, phân trang offset)',
  })
  @ApiParam({ name: 'blogId', type: Number, description: 'ID của blog' })
  viewBlogComments(
    @Param('blogId') blogId: number,
    @Query() queryCommentDto: GetBlogCommentsDto,
  ) {
    return this.commentService.findByBlog(blogId, queryCommentDto);
  }

  @Get('blog/:blogId/comment')
  @Version('2')
  @ApiOperation({
    summary: 'Danh sách bình luận của blog (v2, phân trang cursor)',
  })
  @ApiParam({ name: 'blogId', type: Number, description: 'ID của blog' })
  viewBlogCommentsV2(
    @Param('blogId') blogId: number,
    @Query() queryCommentDto: GetCursorBlogCommentsDto,
  ) {
    return this.commentService.findByBlogWithCursor(blogId, queryCommentDto);
  }

  @Get('comment/:commentId/replies')
  @ApiOperation({ summary: 'Lấy các phản hồi của một bình luận' })
  @ApiParam({
    name: 'commentId',
    type: Number,
    description: 'ID của bình luận',
  })
  getCommentReplies(@Param('commentId') commentId: number) {
    return this.commentService.findReplies(commentId);
  }

  @Patch('comment/:id')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Sửa bình luận (chỉ chủ sở hữu)' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của bình luận' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  updateComment(
    @CurrentUser('sub') userId: number,
    @Param('id') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update({
      userId,
      commentId,
      ...updateCommentDto,
    });
  }
}
