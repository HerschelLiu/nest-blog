import { Injectable } from '@nestjs/common'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ArticleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) {}
  create(createArticleDto: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        content: createArticleDto.content
      }
    })
  }

  async findAll(page = 1) {
    const row = +this.config.get('ARTICLE_PAGE_ROW')
    const articles = await this.prisma.article.findMany({
      skip: (page - 1) * row,
      take: row
    })

    const total = await this.prisma.article.count()

    return {
      meta: {
        total,
        page,
        row,
        total_page: Math.ceil(total / row)
      },
      data: articles
    }
  }

  async findOne(id: number) {
    return await this.prisma.article.findFirst({
      where: {
        id
      }
    })
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: {
        id
      },
      data: updateArticleDto
    })
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: {
        id
      }
    })
  }
}
