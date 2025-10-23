import { mutationOptions, queryOptions } from '@tanstack/react-query';

import {
  createQuizzesControllerCreateQuizzesAdmin,
  getQuizControllerGetQuizzesAdmin,
  listQuizzesControllerListQuizzes,
  updateQuizControllerUpdateQuizAdmin,
} from '@/lib/admins/_generated/quizzesGameIoBackend';
import type {
  CreateQuizzesDto,
  UpdateQuizDto,
} from '@/lib/apis/_generated/quizzesGameIoBackend.schemas';

interface UpdateParams {
  quizId: string;
  updateQuizDto: UpdateQuizDto;
}

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
  singleUpdate: mutationOptions({
    mutationKey: ['quiz', 'modified'] as const,
    mutationFn: ({ quizId, updateQuizDto }: UpdateParams) =>
      updateQuizControllerUpdateQuizAdmin(quizId, updateQuizDto),
  }),
};
