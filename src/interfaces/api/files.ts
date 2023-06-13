import { ChunkProcessStatus } from '@/enums/file';
export interface IUploadFilePayload {
  file: File;
}

export interface IUploadFileResponse {
  fileName: string;
  fileSize: number;
  id: string;
  mimeType: string;
  uploadedBy: string;
  url: string;
}

export interface IMinifyFilePayload {
  files: Record<
    string,
    {
      content: string;
      mediaType: string;
    }
  >;
}

export interface IMinifyFileResponse {
  files: Record<
    string,
    {
      content: string;
      mediaType: string;
      deflate: string;
    }
  >;
}

export interface IInitiateMultipartUploadPayload {
  fileName: string;
  group?: string;
}

export interface IInitiateMultipartUploadResponse {
  uploadId: string;
}

export interface ICompleteMultipartUploadPayload {
  uploadId: string;
}

export interface ICompleteMultipartUploadResponse {
  fileUrl: string;
}

export interface IResizeImagePayload {
  file: string; // fileBase64
}

export interface IResizeImageResponse {
  file: string; // fileBase64
}

export interface ICompressFileAndGetSizePayload {
  fileBase64: string;
}

export interface ICompressFileAndGetSizeResponse {
  originalSize: number;
  compressedSize: number;
}

export interface IGetFileChunkResponse {
  id: string;
  status: ChunkProcessStatus;
  createdAt: string;
  fileId: string;
  chunkIndex: number;
  chunkData: string;
  txHash: string;
}
