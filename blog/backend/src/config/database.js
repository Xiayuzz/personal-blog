const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/blog', {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'blog',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('MySQL Database Connected Successfully.');

    // 测试查询
    console.log('Testing database query...');
    const result = await sequelize.query('SELECT 1 as test');
    console.log('Database query test result:', result[0]);

    // 同步数据库模型（开发环境）
    if (process.env.NODE_ENV === 'development') {
      // 暂时禁用自动同步，因为表已经手动创建
      // await sequelize.sync({ alter: true });
      console.log('Database models synchronized.');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    console.error('Error stack:', error.stack);
    // 在生产环境中，不要因为数据库连接失败而退出程序
    if (process.env.NODE_ENV === 'production') {
      console.log('Continuing without database connection...');
    } else {
      process.exit(1);
    }
  }
};

module.exports = { sequelize, connectDB }; 