const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// 用户注册
const register = async (req, res) => {
  try {
    console.log('注册请求开始...');
    console.log('请求体:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('验证错误:', errors.array());
      return res.status(400).json({
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;
    console.log('提取的数据:', { username, email, password: '***' });

    // 检查用户是否已存在
    console.log('检查用户是否已存在...');
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      console.log('用户已存在');
      return res.status(400).json({
        message: '用户名或邮箱已存在'
      });
    }

    console.log('用户不存在，开始创建新用户...');
    // 创建新用户
    const user = await User.create({
      username,
      email,
      password,
      role: 'user'
    });
    console.log('用户创建成功:', user.id);

    // 生成令牌
    console.log('生成JWT令牌...');
    const token = generateToken(user.id);
    console.log('令牌生成成功');

    console.log('注册成功，返回响应');
    res.status(201).json({
      message: '用户注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('注册错误详情:');
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    console.error('错误名称:', error.name);
    if (error.parent) {
      console.error('数据库错误:', error.parent.message);
    }
    res.status(500).json({ 
      message: '服务器内部错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 用户登录
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 检查用户状态
    if (!user.isActive) {
      return res.status(401).json({ message: '账户已被禁用' });
    }

    // 生成令牌
    const token = generateToken(user.id);

    res.json({
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取当前用户信息
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新用户信息
const updateProfile = async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    // 检查用户名是否已被其他用户使用
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    // 检查邮箱是否已被其他用户使用
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: '邮箱已存在' });
      }
    }

    // 更新用户信息
    await user.update({
      username: username || user.username,
      email: email || user.email,
      bio: bio !== undefined ? bio : user.bio,
      avatar: avatar || user.avatar
    });

    res.json({
      message: '用户信息更新成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
}; 