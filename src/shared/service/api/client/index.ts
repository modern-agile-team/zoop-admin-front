import ky, { HTTPError } from 'ky';

import { API_URL } from '@/shared/constant/env';
import { STORAGE } from '@/shared/utils/storage';

import { ApiError, type ApiErrorResponse } from './apiError';

export const apiClient = ky.create({
  prefixUrl: API_URL,
  headers: {
    'Accept-Language': 'ko-KR',
  },
  retry: { limit: 0 },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = STORAGE.getAuthToken();
        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      (_, _1, response) => {
        if (response.status === 401 || response.status === 403) {
          STORAGE.removeAuthToken();
        }
      },
    ],
  },
});

export const orvalInstance = async <T>({
  url,
  method,
  headers,
  params,
  data,
}: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, string | number | boolean | unknown>;
  headers?:
    | NonNullable<RequestInit['headers']>
    | Record<string, string | undefined>;
  data?: unknown;
}) => {
  const [, ...rawUrl] = url.split('/');
  const isFormData =
    typeof FormData !== 'undefined' && data instanceof FormData;

  try {
    const response = await apiClient(rawUrl.join('/'), {
      method,
      ...(isFormData ? { body: data as BodyInit } : { json: data }),
      searchParams: params ? serializeParams(params) : undefined,
      hooks: {
        beforeRequest: [
          (request) => {
            const headerEntries = Object.entries(headers ?? {});
            headerEntries
              .filter(([, value]) => value !== undefined)
              .forEach(([key, value]) => {
                if (isFormData && key.toLowerCase() === 'content-type') return;
                request.headers.set(key, value as string);
              });
          },
        ],
      },
    });

    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    const isNoContentStatus =
      response.status === 204 || response.status === 205;
    const isZeroLength = contentLength === '0';
    const isJson = !!contentType && /application\/json/i.test(contentType);
    if (isNoContentStatus || isZeroLength || !isJson) {
      // No body to parse (e.g., DELETE 204). Return void/undefined.
      return undefined as T;
    }

    return response.json<T>();
  } catch (error) {
    if (error instanceof HTTPError) {
      let payload: unknown;
      try {
        const errContentType = error.response.headers.get('content-type');
        const isJson =
          !!errContentType && /application\/json/i.test(errContentType);
        if (isJson) {
          payload = await error.response.json();
        } else {
          const text = await error.response.text();
          payload = {
            statusCode: error.response.status,
            message: text || error.message,
          };
        }
      } catch {
        payload = { statusCode: error.response.status, message: error.message };
      }
      throw new ApiError(payload as ApiErrorResponse);
    } else {
      throw error;
    }
  }
};

/**
 * undefined, null 값을 제거하고 문자열로 변환하는 함수
 */
function serializeParams(
  params: Record<string, string | number | boolean | unknown>
) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, String(v)])
  );
}
