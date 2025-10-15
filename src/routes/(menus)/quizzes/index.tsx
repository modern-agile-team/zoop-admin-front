import { createFileRoute } from '@tanstack/react-router';

import QuizPage from '@/apps/quizzes';

export const Route = createFileRoute('/(menus)/quizzes/')({
  component: QuizPage,
});
