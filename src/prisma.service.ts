import { Injectable, Logger } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from 'generated/prisma/client';
import { envs } from './config/envs';

@Injectable()
export class PrismaService extends PrismaClient {
    private logger = new Logger('PrismaService')
    constructor() {
        const adapter = new PrismaBetterSqlite3({ url: envs.database_url });
        super({ adapter });
        this.logger.log("Database Connected");
    }
}