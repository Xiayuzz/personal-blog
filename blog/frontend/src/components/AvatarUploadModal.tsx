import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';

interface AvatarUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ open, onClose, onUpload }) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    if (!image || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      setPreview(URL.createObjectURL(croppedBlob));
      onUpload(new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' }));
      onClose();
    } catch (e) {
      alert('裁剪失败，请重试');
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
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">取消</button>
              <button
                onClick={handleCrop}
                className="px-6 py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-60"
                disabled={loading}
              >
                {loading ? '上传中...' : '裁剪并上传'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvatarUploadModal; 