import chokidar, { FSWatcher } from 'chokidar';
import { EventEmitter } from 'events';

import { useEffect } from 'react';

const watcher = chokidar.watch([]) as FSWatcher & EventEmitter;

interface UseWatcherProps {
  filePath: string;
  onChange: () => void;
}

export const useWatcher = ({ filePath, onChange }: UseWatcherProps) => {
  useEffect(() => {
    if (!filePath) return;
    watcher.add(filePath);
    watcher.removeAllListeners('change');
    watcher.on('change', onChange);
    return () => {
      watcher.unwatch(filePath);
    };
  }, [filePath, onChange]);
};
