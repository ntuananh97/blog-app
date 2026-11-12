import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetBlogCommentsDto } from './dto/get-blog-comment-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCursorBlogCommentsDto } from './dto/get-blog-comment-cursor-query.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(data: { userId: number; blogId: number } & CreateCommentDto) {
    const { userId, blogId, parentId, message } = data;
    // Check blog exist
    const blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId,
      },
      select: {
        id: true,
      },
    });
    if (!blog) {
      throw new NotFoundException('Blog doesnt exist');
    }

    let rootParentId: number | undefined;
    // If parentId, check comment exist
    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: {
          id: parentId,
        },
        select: { id: true, blogId: true, parentId: true },
      });
      if (!parent) throw new BadRequestException('ParentId not found');

      // Check parentId belongs to blog

      if (parent.blogId !== blogId) {
        throw new BadRequestException(
          'Parent comment is not belongs to this blog',
        );
      }
      rootParentId = parent.parentId ?? parentId;
    }
    // Create a new comment
    const newComment = await this.prisma.comment.create({
      data: {
        message,
        parentId: rootParentId,
        blogId,
        authorId: userId,
      },
    });
    return {
      data: newComment,
    };
  }

  async findByBlog(blogId: number, queryCommentDto: GetBlogCommentsDto) {
    // Calc pagination
    const { limit, page } = queryCommentDto;

    // Get only root comments
    const where = {
      blogId,
      parentId: null,
    };

    const [comments, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where,
        take: limit,
        skip: limit * (page - 1),
        orderBy: [{ createdAt: 'desc' }],
        include: {
          _count: {
            select: {
              replies: true,
            },
          },
        },
      }),
      this.prisma.comment.count({ where }),
    ]);
    return {
      data: comments,
      pagination: {
        total,
        limit,
        page,
      },
    };
  }

  async findByBlogWithCursor(
    blogId: number,
    queryCommentDto: GetCursorBlogCommentsDto,
  ) {
    // Calc pagination
    const { limit, cursor } = queryCommentDto;

    // Get only root comments
    const where = {
      blogId,
      parentId: null,
    };

    const comments = await this.prisma.comment.findMany({
      where,
      take: limit + 1, // Check hasNextPage
      ...(cursor && {
        cursor: { id: cursor }, // Field user cursor must be unique
        skip: 1, // Ignore current cursor row
      }),
      orderBy: [{ id: 'desc' }],
      include: {
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    const hasNextPage = comments.length > limit;
    const data = hasNextPage
      ? comments.slice(0, comments.length - 1)
      : comments;
    const nextCursor = hasNextPage ? data[data.length - 1].id : null;

    return {
      data,
      pagination: {
        hasNextPage,
        limit,
        nextCursor,
      },
    };
  }

  async findReplies(commentId: number) {
    // Get only root comments
    const where = {
      parentId: commentId,
    };

    const replies = await this.prisma.comment.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      data: replies,
    };
  }

  async update(data: { userId: number; commentId: number } & UpdateCommentDto) {
    const { userId, commentId, message } = data;
    // Check comment exist
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found.');

    // Check comment belongs to current user in token
    if (userId !== comment.authorId)
      throw new ForbiddenException('You are not allow to update this comment');

    // Update cmt
    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        message,
      },
    });

    return {
      data: updatedComment,
    };
  }
}
