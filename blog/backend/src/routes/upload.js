const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  getFileInfo,
  getFileList
} = require('../controllers/uploadController');

const router = express.Router();

// 单文件上传
router.post('/single', auth, uploadMiddleware.single('file'), uploadMiddleware.handleError, uploadFile);

// 多文件上传
router.post('/multiple', auth, uploadMiddleware.array('files', 5), uploadMiddleware.handleError, uploadMultipleFiles);

// 图片上传（专用）
router.post('/image', auth, uploadMiddleware.image, uploadMiddleware.handleError, uploadFile);

// 获取文件列表
router.get('/files', auth, getFileList);

// 获取文件信息
router.get('/files/:filename', auth, getFileInfo);

// 删除文件
router.delete('/files/:filename', auth, adminAuth, deleteFile);

module.exports = router; 