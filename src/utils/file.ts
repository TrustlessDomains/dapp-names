import { ERC721_SUPPORTED_EXTENSIONS, IMAGE_EXTENSIONS, NAIVE_MIMES, SUPPORTED_FILE_EXT } from '@/constants/file';
import { MediaType } from '@/enums/file';

export function getNaiveMimeType(filename: string): string | false {
  const ext = filename.split('.').pop();
  return (ext && NAIVE_MIMES[ext]) || false;
}

export const getFileExtensionByFileName = (fileName: string): string | null => {
  const fileExt = fileName.split('.').pop();
  return fileExt ?? null;
};

export const getMediaTypeFromFileExt = (ext: string): MediaType | null => {
  const supportedFile = SUPPORTED_FILE_EXT.find(item => {
    return item.ext.toLowerCase() === ext.toLowerCase();
  });
  if (supportedFile) {
    return supportedFile.mediaType;
  }
  return null;
};

export const getFileNameFromUrl = (url: string): string => {
  return url.substring(url.lastIndexOf('/') + 1, url.length);
};

export const isImageFile = (file: File): boolean => {
  const fileName = file.name;
  const fileExt = getFileExtensionByFileName(fileName);
  if (!fileExt) {
    return false;
  }
  return IMAGE_EXTENSIONS.includes(fileExt);
};

export const isERC721SupportedExt = (fileExt: string | null | undefined): boolean => {
  if (!fileExt) {
    return false;
  }

  return ERC721_SUPPORTED_EXTENSIONS.some((ext: string) => ext.toLowerCase() === fileExt.toLowerCase());
};
