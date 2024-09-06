import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import Validate from './common/validate'
import { TransformInterceptor } from './transform.interceptor'
import { NestExpressApplication } from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(new Validate())
  app.useGlobalInterceptors(new TransformInterceptor())
  // 前缀 所有接口需要有 api 前缀
  app.setGlobalPrefix('api')
  await app.listen(3000)
}
bootstrap()
