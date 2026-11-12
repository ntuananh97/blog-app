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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JWTAuthGuard } from 'src/auth/guard/auth.guard';
import { GetBlogCommentsDto } from './dto/get-blog-comment-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCursorBlogCommentsDto } from './dto/get-blog-comment-cursor-query.dto';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('blog/:blogId/comment')
  @UseGuards(JWTAuthGuard)
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
  viewBlogComments(
    @Param('blogId') blogId: number,
    @Query() queryCommentDto: GetBlogCommentsDto,
  ) {
    return this.commentService.findByBlog(blogId, queryCommentDto);
  }

  @Get('blog/:blogId/comment')
  @Version('2')
  viewBlogCommentsV2(
    @Param('blogId') blogId: number,
    @Query() queryCommentDto: GetCursorBlogCommentsDto,
  ) {
    return this.commentService.findByBlogWithCursor(blogId, queryCommentDto);
  }

  @Get('comment/:commentId/replies')
  getCommentReplies(@Param('commentId') commentId: number) {
    return this.commentService.findReplies(commentId);
  }

  @Patch('comment/:id')
  @UseGuards(JWTAuthGuard)
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
