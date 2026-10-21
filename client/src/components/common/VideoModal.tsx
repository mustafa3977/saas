import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#141414] border border-[#2A2A2A] rounded-sm overflow-hidden shadow-2xl z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-b border-[#2A2A2A]">
          <h3 className="font-oswald text-xs sm:text-sm uppercase tracking-wider text-white truncate pr-4">
            {title || 'Legacy Pixels Reel'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-[#B5B5B5] hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Embed Container */}
        <div className="relative w-full pt-[56.25%] bg-black">
          <iframe
            src={videoUrl}
            title={title || 'Legacy Pixels Video Player'}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};
