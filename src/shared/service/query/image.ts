import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createImageControllerCreateImageAdmin,
  deleteImageControllerDeleteImage,
  listImagesControllerListImagesAdmin,
} from '@/lib/admins/_generated/quizzesGameIoBackend';
import type { ListImagesControllerListImagesAdminParams } from '@/lib/admins/_generated/quizzesGameIoBackend.schemas';

export const imageQueries = {
  uploadImage: mutationOptions({
    mutationFn: createImageControllerCreateImageAdmin,
  }),
  removeImage: mutationOptions({
    mutationFn: deleteImageControllerDeleteImage,
  }),
  getList: (params: ListImagesControllerListImagesAdminParams) =>
    queryOptions({
      queryKey: ['admin', 'images', 'list', params] as const,
      queryFn: () => listImagesControllerListImagesAdmin(params),
    }),
};
