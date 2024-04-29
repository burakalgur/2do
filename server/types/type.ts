export interface IFileHelper {
    maxSize:number,
    allowedFileFormats: string[],
    allowedImageFormats: string[],
    validateFileSize(file: any): boolean;
    validateFileFormat(file: any, allowedFormats: string[]): boolean;
    encodeFileToBase64(file: any): Promise<string>;
}

export interface TaskWithFiles  {
    _id: string;
    text: string;
    thumbnail: string;
    status: string;
    file: string;
    priority: string;
    userId: string;
    __v: number;
    fileData?: Buffer;
    thumbnailData?: Buffer;
  }