import {
  IUploadFilePayload,
  IUploadFileResponse,
  ICompressFileAndGetSizePayload,
  ICompressFileAndGetSizeResponse,
} from '@/interfaces/api/files';
import { camelCaseKeys } from '@trustless-computer/dapp-core';
import { apiClient } from '.';

const API_PATH = '/upload';

export const uploadFile = async (
  payload: IUploadFilePayload,
): Promise<IUploadFileResponse> => {
  try {
    const formData = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      formData.append(key, value);
    }
    const res = await apiClient.post(`${API_PATH}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return Object(camelCaseKeys(res));
  } catch (err: unknown) {
    throw Error('Failed to upload file');
  }
};

export const compressFileAndGetSize = async (
  payload: ICompressFileAndGetSizePayload,
): Promise<ICompressFileAndGetSizeResponse> => {
  try {
    const { fileBase64 } = payload;
    const res = await apiClient.post<IGetFileChunkResponse>(
      `${API_PATH}/file-size`,
      {
        file_content: fileBase64,
      },
    );
    return Object(camelCaseKeys(res));
  } catch (err: unknown) {
    throw Error('Failed to compress and get size');
  }
};
