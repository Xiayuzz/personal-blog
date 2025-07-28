const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 根据文件类型创建子目录
    let subDir = 'general';
    if (file.mimetype.startsWith('image/')) {
      subDir = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subDir = 'videos';
    } else if (file.mimetype.startsWith('audio/')) {
      subDir = 'audio';
    } else if (file.mimetype.includes('document') || file.mimetype.includes('pdf')) {
      subDir = 'documents';
    }
    
    const dir = path.join(uploadDir, subDir);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的文件类型
  const allowedMimeTypes = [
    // 图片
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // 视频
    'video/mp4',
    'video/webm',
    'video/ogg',
    // 音频
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    // 文档
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'), false);
  }
};

// 创建multer实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // 最多5个文件
  }
});

// 错误处理中间件
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: '文件大小超过限制（最大10MB）' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: '文件数量超过限制（最多5个）' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: '意外的文件字段' });
    }
  }
  
  if (error.message === '不支持的文件类型') {
    return res.status(400).json({ message: '不支持的文件类型' });
  }
  
  next(error);
};

// 导出不同配置的上传中间件
module.exports = {
  // 单文件上传
  single: (fieldName) => upload.single(fieldName),
  
  // 多文件上传
  array: (fieldName, maxCount) => upload.array(fieldName, maxCount),
  
  // 多个字段上传
  fields: (fields) => upload.fields(fields),
  
  // 错误处理
  handleError: handleUploadError,
  
  // 图片专用上传（更严格的限制）
  image: multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedImageTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
      ];
      
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('只支持图片文件（JPEG, PNG, GIF, WebP）'), false);
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 1
    }
  }).single('file')
}; 