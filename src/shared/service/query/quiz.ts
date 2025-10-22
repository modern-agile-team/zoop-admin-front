import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createQuizzesControllerCreateQuizzesAdmin,
  getQuizControllerGetQuizzesAdmin,
  listQuizzesControllerListQuizzes,
} from '@/lib/admins/_generated/quizzesGameIoBackend';
import type { CreateQuizzesDto } from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

export const quizQueries = {
  getList: queryOptions({
    queryKey: ['quiz'] as const,
    queryFn: listQuizzesControllerListQuizzes,
  }),
  getSingle: (id: string) =>
    queryOptions({
      queryKey: ['quiz', id] as const,
      queryFn: () => getQuizControllerGetQuizzesAdmin(id),
    }),
  bulkUpload: mutationOptions({
    mutationKey: ['quiz', 'create'] as const,
    mutationFn: (createQuizzesDto: CreateQuizzesDto[]) =>
      createQuizzesControllerCreateQuizzesAdmin(createQuizzesDto),
  }),
};
