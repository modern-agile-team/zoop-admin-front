import { createFileRoute } from '@tanstack/react-router';

import SingleQuiz from '@/apps/quizzes/components/SingleQuiz';
import { queryClient } from '@/lib/queryClient';
import { quizQueries } from '@/shared/service/query/quiz';

export const Route = createFileRoute('/(menus)/quizzes/$id/')({
  loader: async ({ params }) => {
    const { id } = params;
    await queryClient.ensureQueryData(quizQueries.getSingle(id));
  },
  component: SingleQuiz,
});
