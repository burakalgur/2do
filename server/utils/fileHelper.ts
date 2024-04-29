import fs from 'fs';
import path from 'path';

interface IFileValidationResult {
  isValid: boolean;
  message?: string;
}

class FileHelper {
  constructor(
    private maxSize = 5 * 1024 * 1024,
    private allowedFileFormats: string[] = [],
    private allowedImageFormats: string[] = []
  ) {}

  validateFileSize(fileSize: number): IFileValidationResult {
    if (fileSize > this.maxSize) {
      return { isValid: false, message: 'File size exceeds the maximum allowed size' };
    }
    return { isValid: true };
  }

  validateFileFormat(fileName: string, allowedFormats: string[]): IFileValidationResult {
    const ext = path.extname(fileName).toLowerCase();
    if (!allowedFormats.includes(ext)) {
      return { isValid: false, message: 'File format is not allowed' };
    }
    return { isValid: true };
  }

  encodeFileToBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const base64String = data.toString('base64');
          resolve(base64String);
        }
      });
    });
  }
}

export default FileHelper;
