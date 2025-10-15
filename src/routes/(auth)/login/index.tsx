import { createFileRoute } from '@tanstack/react-router';

import LoginPage from '@/apps/login';

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
});
