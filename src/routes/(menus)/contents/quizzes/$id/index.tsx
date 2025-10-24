import { createFileRoute } from '@tanstack/react-router';

import SingleQuiz from '@/apps/quizzes/components/SingleQuiz';
import { queryClient } from '@/lib/queryClient';
import ErrorComponent from '@/shared/components/Error';
import { quizQueries } from '@/shared/service/query/quiz';

export const Route = createFileRoute('/(menus)/contents/quizzes/$id/')({
  loader: async ({ params }) => {
    const { id } = params;
    await queryClient.ensureQueryData(quizQueries.getSingle(id));
  },
  errorComponent: () => {
    return (
      <ErrorComponent
        status={500}
        title="퀴즈를 불러올 수 없습니다."
        description="데이터를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      />
    );
  },
  component: SingleQuiz,
});
