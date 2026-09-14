import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface FullscreenContextType {
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  hasAttemptedAuto: boolean;
}

const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [userDismissed, setUserDismissed] = useState<boolean>(false);
  const [hasAttemptedAuto, setHasAttemptedAuto] = useState<boolean>(false);

  // Sync state with browser fullscreen status
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFull);
      if (!isFull) {
        // User exited fullscreen (e.g. pressed Esc)
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Initial check
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement as any;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
      setUserDismissed(false);
    } catch (err) {
      console.warn('Fullscreen request failed or was blocked by browser:', err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      const doc = document as any;
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
      }
      setUserDismissed(true);
    } catch (err) {
      console.warn('Exit fullscreen failed:', err);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Auto-enter fullscreen on first user interaction anywhere on the app
  useEffect(() => {
    const handleUserInteraction = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isFull && !userDismissed) {
        enterFullscreen();
        setHasAttemptedAuto(true);
      }
    };

    window.addEventListener('click', handleUserInteraction, { capture: true });
    window.addEventListener('touchstart', handleUserInteraction, { capture: true });
    window.addEventListener('keydown', handleUserInteraction, { capture: true });

    return () => {
      window.removeEventListener('click', handleUserInteraction, { capture: true });
      window.removeEventListener('touchstart', handleUserInteraction, { capture: true });
      window.removeEventListener('keydown', handleUserInteraction, { capture: true });
    };
  }, [enterFullscreen, userDismissed]);

  return (
    <FullscreenContext.Provider
      value={{
        isFullscreen,
        enterFullscreen,
        exitFullscreen,
        toggleFullscreen,
        hasAttemptedAuto,
      }}
    >
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (!context) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};

// Component for Fullscreen Toggle Button that can be placed anywhere
export const FullscreenButton: React.FC<{ className?: string; title?: string }> = ({
  className = '',
  title = 'Toggle Fullscreen',
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFullscreen();
      }}
      className={`p-2 rounded-xl transition-colors hover:bg-surface-100 text-surface-600 hover:text-surface-900 flex items-center justify-center ${className}`}
      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen'}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? (
        <Minimize2 className="w-5 h-5" />
      ) : (
        <Maximize2 className="w-5 h-5" />
      )}
    </button>
  );
};
