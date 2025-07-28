import React from 'react';
import Avatar from '@/components/Avatar';

const TestAvatar = () => {
  const testAvatarUrl = 'http://localhost:3000/uploads/images/file-1753612416435-618075086.png';
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">头像测试页面</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">测试头像URL</h2>
          <p className="text-sm text-gray-600 mb-4">{testAvatarUrl}</p>
          
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20">
              <Avatar 
                src={testAvatarUrl}
                alt="测试头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
            
            <div className="w-32 h-32">
              <Avatar 
                src={testAvatarUrl}
                alt="测试头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
            
            <div className="w-40 h-40">
              <Avatar 
                src={testAvatarUrl}
                alt="测试头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">默认头像测试</h2>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20">
              <Avatar 
                src=""
                alt="默认头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
            
            <div className="w-32 h-32">
              <Avatar 
                src=""
                alt="默认头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-3">错误URL测试</h2>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20">
              <Avatar 
                src="http://localhost:3000/uploads/nonexistent.png"
                alt="错误头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
            
            <div className="w-32 h-32">
              <Avatar 
                src="http://localhost:3000/uploads/nonexistent.png"
                alt="错误头像"
                username="TestUser"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAvatar; 