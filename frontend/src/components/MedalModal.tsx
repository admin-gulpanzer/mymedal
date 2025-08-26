import React, { useState, useEffect } from 'react';

interface MedalModalProps {
  medal: any;
  isOpen: boolean;
  onClose: () => void;
}

const MedalModal: React.FC<MedalModalProps> = ({ medal, isOpen, onClose }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [downloadMessage, setDownloadMessage] = useState('');

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !medal) return null;

  const shareMedal = async () => {
    setIsSharing(true);
    setShareMessage('');

    try {
      // Check if Web Share API is supported and available
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: `${medal.name} Achievement`,
          text: `I completed ${medal.name} in ${medal.time}!`,
          url: window.location.href
        };

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          // Close modal after successful share
          setTimeout(() => {
            onClose();
          }, 500);
        } else {
          throw new Error('Share data not supported');
        }
      } else {
        // Fallback to clipboard
        const shareText = `I completed ${medal.name} in ${medal.time}!`;
        await navigator.clipboard.writeText(shareText);
        setShareMessage('Achievement copied to clipboard!');
        
        // Auto-close message after 2 seconds
        setTimeout(() => {
          setShareMessage('');
        }, 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
      
      // Final fallback - try to copy to clipboard with user interaction
      try {
        const shareText = `I completed ${medal.name} in ${medal.time}!`;
        await navigator.clipboard.writeText(shareText);
        setShareMessage('Achievement copied to clipboard!');
      } catch (clipboardError) {
        // If clipboard also fails, show manual copy message
        setShareMessage('Please manually copy: I completed ' + medal.name + ' in ' + medal.time + '!');
      }
      
      // Auto-close message after 3 seconds
      setTimeout(() => {
        setShareMessage('');
      }, 3000);
    } finally {
      setIsSharing(false);
    }
  };

  const downloadMedal = () => {
    setIsDownloading(true);
    setDownloadMessage('');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 1000;
    
    if (ctx) {
      // Create background
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 800, 1000);
      
      // Add gradient background for better visual appeal
      const gradient = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient.addColorStop(0, '#2a2a2a');
      gradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1000);
      
      // Load the medal image
      const medalImg = new Image();
      medalImg.crossOrigin = 'anonymous';
      
      medalImg.onload = () => {
        // Draw the medal image in the center
        const medalWidth = 300;
        const medalHeight = 450;
        const medalX = (canvas.width - medalWidth) / 2;
        const medalY = 100;
        
        ctx.drawImage(medalImg, medalX, medalY, medalWidth, medalHeight);
        
        // Add a subtle glow effect around the medal
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        ctx.drawImage(medalImg, medalX, medalY, medalWidth, medalHeight);
        ctx.shadowBlur = 0;
        
        // Add achievement text below the medal
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(medal.name, 400, 600);
        
        // Add completion date
        ctx.font = '24px Arial';
        ctx.fillStyle = '#cccccc';
        ctx.fillText(`Completed: ${medal.date}`, 400, 640);
        
        // Add time with green color
        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`Time: ${medal.time}`, 400, 680);
        
        // Add distance
        ctx.fillStyle = '#cccccc';
        ctx.font = '24px Arial';
        ctx.fillText(`Distance: ${medal.distance}`, 400, 720);
        
        // Add achievement badge at the top
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(400, 50, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add star icon in the badge
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('★', 400, 58);
        
        // Add decorative elements
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 750);
        ctx.lineTo(300, 750);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(500, 750);
        ctx.lineTo(700, 750);
        ctx.stroke();
        
        // Add small achievement icons
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(150, 800, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏃', 150, 805);
        
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(400, 800, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏅', 400, 805);
        
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(650, 800, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', 650, 805);
        
        // Add footer text
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.fillText('MyMedal Achievement', 400, 950);
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${medal.name.replace(/\s+/g, '_')}_medal.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            setIsDownloading(false);
            setDownloadMessage('Medal downloaded successfully!');
            
            // Auto-close message after 3 seconds
            setTimeout(() => {
              setDownloadMessage('');
            }, 3000);
          }
        }, 'image/png');
      };
      
      medalImg.onerror = () => {
        // Fallback if image fails to load
        console.error('Failed to load medal image');
        // Create a simple medal icon as fallback
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(400, 200, 80, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(medal.name, 400, 350);
        ctx.font = '24px Arial';
        ctx.fillText(`Completed: ${medal.date}`, 400, 390);
        ctx.fillText(`Time: ${medal.time}`, 400, 420);
        ctx.fillText(`Distance: ${medal.distance}`, 400, 450);
        
        // Download fallback
        const link = document.createElement('a');
        link.download = `${medal.name.replace(/\s+/g, '_')}_medal.png`;
        link.href = canvas.toDataURL();
        link.click();
        setIsDownloading(false);
        setDownloadMessage('Medal downloaded successfully!');
        
        // Auto-close message after 3 seconds
        setTimeout(() => {
          setDownloadMessage('');
        }, 3000);
      };
      
      // Set the source to trigger loading
      medalImg.src = '/goldmedal.png';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="medal-title"
    >
      <div 
        className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl 
                   p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto
                   relative shadow-2xl" 
        onClick={handleModalClick}
      >
        <button 
          className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl 
                     bg-transparent border-none cursor-pointer transition-colors duration-200
                     z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        
        <div className="flex flex-col items-center text-center mb-6">
          <img 
            src="/goldmedal.png" 
            alt={`Medal - ${medal.name}`}
            className="w-64 h-96 sm:w-72 sm:h-108 object-cover mb-6"
          />
          <h2 id="medal-title" className="text-xl sm:text-2xl font-bold text-white mb-2">{medal.name}</h2>
          <p className="text-gray-300 text-base opacity-80 m-0">{medal.date}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="flex flex-col items-center p-3 text-center">
            <span className="text-xs text-gray-400 mb-1">BIB:</span>
            <span className="text-sm text-white">#{Math.floor(Math.random() * 9000) + 1000}</span>
          </div>
          <div className="flex flex-col items-center p-3 text-center">
            <span className="text-xs text-gray-400 mb-1">Distance:</span>
            <span className="text-sm text-white">{medal.distance}</span>
          </div>
          <div className="flex flex-col items-center p-3 text-center">
            <span className="text-xs text-gray-400 mb-1">Finish Time:</span>
            <span className="text-sm text-green-400 font-semibold">{medal.time}</span>
          </div>
          <div className="flex flex-col items-center p-3 text-center">
            <span className="text-xs text-gray-400 mb-1">Rank:</span>
            <span className="text-sm text-white">1,247 / 30,000</span>
          </div>
        </div>
        
        {/* Share message display */}
        {shareMessage && (
          <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm text-center m-0">{shareMessage}</p>
          </div>
        )}

        {/* Download message display */}
        {downloadMessage && (
          <div className="mb-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
            <p className="text-green-300 text-sm text-center m-0">{downloadMessage}</p>
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 hover:bg-blue-600
                       border border-blue-500/50 rounded-lg text-white text-sm font-medium
                       cursor-pointer transition-all duration-200 ease-in-out disabled:opacity-50
                       disabled:cursor-not-allowed"
            onClick={shareMedal}
            disabled={isSharing}
            aria-label="Share medal achievement"
          >
            <i className={`fas ${isSharing ? 'fa-spinner fa-spin' : 'fa-share-alt'}`}></i> 
            {isSharing ? 'Sharing...' : 'Share'}
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600/80 hover:bg-green-600
                       border border-green-500/50 rounded-lg text-white text-sm font-medium
                       cursor-pointer transition-all duration-200 ease-in-out"
            onClick={downloadMedal}
            aria-label="Download medal image"
            disabled={isDownloading}
          >
            <i className={`fas ${isDownloading ? 'fa-spinner fa-spin' : 'fa-download'}`}></i> 
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedalModal;
