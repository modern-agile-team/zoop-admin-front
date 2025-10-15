import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import LoginPage from '@/apps/login';

const urlSearchSchema = z.object({
  redirectUrl: z.string(),
});

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
  loader(ctx) {
    const result = urlSearchSchema.safeParse(ctx.location.search);
    if (!result.success) {
      throw redirect({ to: '/login', search: { redirectUrl: '/' } });
    }
  },
});
