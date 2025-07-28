const path = require('path');
const fs = require('fs').promises;

// 上传文件
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    // 构建完整的文件URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // 获取相对于uploads目录的路径
    const uploadsDir = path.join(__dirname, '../../uploads');
    let relativePath = req.file.path.replace(uploadsDir, '');
    
    // 确保使用正斜杠，并移除开头的斜杠
    relativePath = relativePath.replace(/\\/g, '/').replace(/^\//, '');
    
    // 构建正确的URL - 确保包含子目录
    const fileUrl = `${baseUrl}/uploads/${relativePath}`;
    
    console.log('文件上传信息:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      fullPath: req.file.path,
      uploadsDir: uploadsDir,
      relativePath: relativePath,
      fileUrl: fileUrl,
      // 验证URL是否正确
      expectedPath: `uploads/${relativePath}`,
      staticPath: path.join(__dirname, '../../uploads', relativePath),
      // 检查文件是否存在
      fileExists: require('fs').existsSync(req.file.path),
      // 检查URL是否包含正确的子目录
      hasImagesSubdir: relativePath.includes('images/')
    });
    
    res.json({
      message: '文件上传成功',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: req.file.path
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ message: '文件上传失败' });
  }
};

// 上传多个文件
const uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '没有上传文件' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const uploadedFiles = req.files.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      url: `${baseUrl}/uploads/${file.filename}`,
      path: file.path
    }));

    res.json({
      message: '文件上传成功',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload multiple files error:', error);
    res.status(500).json({ message: '文件上传失败' });
  }
};

// 删除文件
const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // 安全检查：确保文件名不包含路径遍历
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: '无效的文件名' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ message: '文件不存在' });
    }

    await fs.unlink(filePath);

    res.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: '文件删除失败' });
  }
};

// 获取文件信息
const getFileInfo = async (req, res) => {
  try {
    const { filename } = req.params;
    
    // 安全检查
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: '无效的文件名' });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filename);
      const mimeType = getMimeType(ext);

      res.json({
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        mimetype: mimeType,
        url: `/uploads/${filename}`
      });
    } catch (error) {
      return res.status(404).json({ message: '文件不存在' });
    }
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ message: '获取文件信息失败' });
  }
};

// 获取MIME类型
const getMimeType = (extension) => {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.ogg': 'video/ogg',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

// 获取上传目录的文件列表
const getFileList = async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const uploadDir = path.join(__dirname, '../../uploads');
    const files = [];
    
    try {
      const items = await fs.readdir(uploadDir, { withFileTypes: true });
      
      for (const item of items) {
        if (item.isFile()) {
          const filePath = path.join(uploadDir, item.name);
          const stats = await fs.stat(filePath);
          const ext = path.extname(item.name);
          
          // 根据类型过滤
          if (type !== 'all') {
            const fileType = getFileType(ext);
            if (fileType !== type) continue;
          }
          
          files.push({
            name: item.name,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            url: `/uploads/${item.name}`,
            type: getFileType(ext)
          });
        }
      }
      
      // 按修改时间排序
      files.sort((a, b) => b.modified - a.modified);
      
      // 分页
      const paginatedFiles = files.slice(offset, offset + parseInt(limit));
      
      res.json({
        files: paginatedFiles,
        total: files.length,
        currentPage: parseInt(page),
        totalPages: Math.ceil(files.length / limit)
      });
    } catch (error) {
      res.json({
        files: [],
        total: 0,
        currentPage: parseInt(page),
        totalPages: 0
      });
    }
  } catch (error) {
    console.error('Get file list error:', error);
    res.status(500).json({ message: '获取文件列表失败' });
  }
};

// 获取文件类型
const getFileType = (extension) => {
  const ext = extension.toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
    return 'image';
  } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
    return 'video';
  } else if (['.mp3', '.wav'].includes(ext)) {
    return 'audio';
  } else if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) {
    return 'document';
  }
  return 'other';
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileInfo,
  getFileList
}; 