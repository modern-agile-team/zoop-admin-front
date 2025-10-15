import { createFileRoute, redirect } from '@tanstack/react-router';
import z from 'zod';

import LoginPage from '@/apps/login';
import { STORAGE } from '@/shared/utils/storage';

const urlSearchSchema = z.object({
  redirectUrl: z.string(),
});

export const Route = createFileRoute('/(auth)/login/')({
  component: LoginPage,
  loader: (ctx) => {
    const result = urlSearchSchema.safeParse(ctx.location.search);

    if (!result.success) {
      throw redirect({ to: '/login', search: { redirectUrl: '/' } });
    }

    if (STORAGE.getAuthToken()) {
      throw redirect({ to: result.data.redirectUrl });
    }
  },
  validateSearch: (search) => {
    const result = urlSearchSchema.safeParse(search);
    if (!result.success) {
      return { redirectUrl: '/' };
    }
    return result.data;
  },
});
