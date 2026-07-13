import React from 'react';

export default function ChatWidget() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center bg-white rounded-full shadow-2xl pr-2 pl-4 py-1.5 space-x-3 cursor-pointer border border-gray-100">
      <span className="text-sm font-medium text-gray-700">Need help? Chat Nancy</span>
      <div className="w-10 h-10 bg-[#E3755D] rounded-full flex items-center justify-center text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
        </svg>
      </div>
    </div>
  );
}
