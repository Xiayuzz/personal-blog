import { useState } from 'react';

interface AvatarUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ open, onClose, onUpload }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // 直接上传原图，不进行裁剪
      const response = await fetch(image);
      const blob = await response.blob();
      onUpload(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
      onClose();
    } catch (e) {
      alert('上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-xl font-bold text-blue-700 mb-4">上传并裁剪头像</h2>
        {!image ? (
          <div className="flex flex-col items-center justify-center h-64">
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
            <button onClick={onClose} className="text-gray-400 hover:text-blue-500 mt-2">取消</button>
          </div>
        ) : (
          <>
            <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src={image} alt="预览" className="w-full h-full object-cover" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">取消</button>
              <button
                onClick={handleCrop}
                className="px-6 py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? '上传中...' : '上传'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarUploadModal; 