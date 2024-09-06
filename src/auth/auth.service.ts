import { BadRequestException, Injectable } from '@nestjs/common'
import RegisterDto from './dto/register.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { hash, verify } from 'argon2'
import { user } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import LoginDto from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  private async token({ name, id }: user) {
    return {
      token: await this.jwt.signAsync({ name, sub: id })
    }
  }

  async register(dto: RegisterDto) {
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        password: await hash(dto.password)
      }
    })

    return this.token(user)
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        name: dto.name
      }
    })

    if (!(await verify(user.password, dto.password))) {
      throw new BadRequestException('密码输入错误')
    }

    return this.token(user)
  }
}
