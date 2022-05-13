const { Sequelize, DataTypes } = require("sequelize");

// データベース接続の初期化
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: !(process.env.NODE_ENV && process.env.NODE_ENV == "production"),
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// Notification テーブルの定義
const Notice = sequelize.define(
  "Notice",
  {
    // メールアドレス
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // 路線名
    lineName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [],
  }
);

// データベース接続とモデルを返す
module.exports = {
  sequelize,
  Notice,
};
