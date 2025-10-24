import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createQuizImageControllerCreateQuizImageAdmin,
  deleteQuizImageControllerDeleteQuizImage,
  listQuizImagesControllerListQuizImagesAdmin,
} from '@/lib/admins/_generated/quizzesGameIoBackend';

export const imageQueries = {
  uploadImage: mutationOptions({
    mutationFn: createQuizImageControllerCreateQuizImageAdmin,
  }),
  removeImage: mutationOptions({
    mutationFn: deleteQuizImageControllerDeleteQuizImage,
  }),
  getList: (
    params: Parameters<typeof listQuizImagesControllerListQuizImagesAdmin>[0]
  ) =>
    queryOptions({
      queryKey: ['admin', 'images', 'list', params] as const,
      queryFn: () => listQuizImagesControllerListQuizImagesAdmin(params),
    }),
};
