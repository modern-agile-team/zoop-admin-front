import { createFileRoute } from '@tanstack/react-router';

import QuizPage from '@/apps/contents/quizzes';

export const Route = createFileRoute('/(menus)/contents/quizzes/')({
  component: QuizPage,
});
