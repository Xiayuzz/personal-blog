const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '访问被拒绝，没有提供令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ message: '令牌无效' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: '令牌无效' });
  }
};

// 可选的认证中间件，不强制要求认证
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        const user = await User.findByPk(decoded.id);

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        console.log('Optional auth failed:', error.message);
        // 不抛出错误，继续执行
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // 继续执行，不阻止请求
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '需要管理员权限' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: '权限不足' });
  }
};

const authorAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'admin' && req.user.role !== 'author') {
        return res.status(403).json({ message: '需要作者权限' });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: '权限不足' });
  }
};

module.exports = { auth, optionalAuth, adminAuth, authorAuth }; 