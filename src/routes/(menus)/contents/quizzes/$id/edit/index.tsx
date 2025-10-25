import { createFileRoute } from '@tanstack/react-router';

import EditQuiz from '@/apps/contents/quizzes/components/SingleQuiz/EditQuiz';

export const Route = createFileRoute('/(menus)/contents/quizzes/$id/edit/')({
  component: EditQuiz,
});
