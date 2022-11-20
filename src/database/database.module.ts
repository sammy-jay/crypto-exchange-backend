import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.get('DATABASE_URL'),
        type: 'postgres',
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [join(__dirname, '/../**', '*.entity.{ts,js}')],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
