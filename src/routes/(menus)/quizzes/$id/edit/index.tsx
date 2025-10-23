import { createFileRoute } from '@tanstack/react-router';

import EditQuiz from '@/apps/quizzes/components/SingleQuiz/EditQuiz';

export const Route = createFileRoute('/(menus)/quizzes/$id/edit/')({
  component: EditQuiz,
});
