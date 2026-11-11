import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryBlogDto } from './dto/query-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(createBlogDto: CreateBlogDto, userId: string) {
    Logger.log('🚀 ~ BlogService ~ create ~ userId:', userId);
    const payload = {
      title: createBlogDto.title,
      content: createBlogDto.content,
    };
    const newBlog = await this.prisma.blog.create({
      data: {
        ...payload,
        authorId: Number(userId),
      },
    });
    return {
      blog: newBlog,
    };
  }

  async findAllPublic(query: QueryBlogDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    // Build Query  + Pagination
    const buildQuery = {};
    // Query db + Count total
    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where: buildQuery,
        include: {
          author: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where: buildQuery }),
    ]);
    return {
      blogs,
      pagination: {
        total,
        limit,
        page,
      },
    };
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return {
      blog,
    };
  }

  async update(id: number, updateBlogDto: UpdateBlogDto, userId: number) {
    // Check blog exist
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
      },
    });
    if (!blog) throw new NotFoundException('blog is not exist');

    // Check user is author
    if (userId !== blog.authorId)
      throw new ForbiddenException('Not allow update');

    const updated = await this.prisma.blog.update({
      where: {
        id,
      },
      data: {
        title: updateBlogDto.title,
        content: updateBlogDto.content,
      },
    });
    return {
      data: updated,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
