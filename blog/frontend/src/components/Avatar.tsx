import React, { useState, useRef } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  username: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, username, className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageError = () => {
    console.log('头像加载失败:', src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('头像加载成功:', imgRef.current?.src);
    setImageError(false);
  };

  if (!src || imageError) {
    // 显示默认头像
    return (
      <div className={`w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${className}`}>
        <span className="text-4xl font-bold text-white">
          {username.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img 
      ref={imgRef}
      src={src}
      alt={alt} 
      className={`w-full h-full rounded-full object-cover ${className}`}
      onError={handleImageError}
      onLoad={handleImageLoad}
      crossOrigin="anonymous"
    />
  );
};

export default Avatar; 