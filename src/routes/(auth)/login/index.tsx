import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import LoginPage from '@/apps/login';

const urlSearchSchema = z.object({
  redirectUrl: z.string(),
});

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
  validateSearch: (search) => {
    const result = urlSearchSchema.safeParse(search);
    if (!result.success) {
      return { redirectUrl: '/' };
    }
    return result.data;
  },
});
