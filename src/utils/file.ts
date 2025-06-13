import fs from 'fs';

class FileUtil {
  static exists(path: string): boolean {
    return fs.existsSync(path);
  }

  static createDirectory(path: string): void {
    fs.mkdirSync(path, { recursive: true });
  }

  static writeFile(path: string, data: string, options?: fs.WriteFileOptions): void {
    fs.writeFileSync(path, data, options);
  }

  static getFileStats(path: string): fs.Stats {
    return fs.statSync(path);
  }
}

export { FileUtil };
