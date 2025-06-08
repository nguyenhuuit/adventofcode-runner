import { exec } from 'child_process';

import { useCallback } from 'react';

export const useVsCode = () => {
  const openFile = useCallback((filePath: string): void => {
    if (process.env['TERM_PROGRAM'] === 'vscode') {
      const command = `code --reuse-window ${filePath}`;
      exec(command, () => {
        // Fire and forget
      });
    }
  }, []);
  return {
    openFile,
  };
};
