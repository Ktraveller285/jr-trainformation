import { DataSource } from 'typeorm';
import { Notice } from './entities/notice.entity';

// 環境変数 DATABASE_URL の読み込み
const databaseUrl: string = process.env['DATABASE_URL'] as string;
if (!databaseUrl) {
  throw '環境変数 DATABASE_URL が未指定です';
}

// データベース接続の初期化
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  logging: !process.env['NODE_ENV'] || process.env['NODE_ENV'] != 'production',
  entities: [Notice],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
});

// 各エンティティをリポジトリとして取得してエクスポート
export const NoticeRepository = AppDataSource.getRepository(Notice);
