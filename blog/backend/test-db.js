require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('Testing database connection...');
console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://root:123456@localhost:3306/blog', {
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  database: process.env.DB_NAME || 'blog',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // 测试查询
    const result = await sequelize.query('SELECT 1 as test');
    console.log('✅ Database query test successful:', result[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    process.exit(1);
  }
}

testConnection(); 