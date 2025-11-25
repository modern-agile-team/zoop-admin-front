import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';

import Avatars from '@/apps/assets/avatars';

const searchParamsSchema = z.object({
  page: z.number().min(1).default(1),
  sortBy: z.string(),
  orderBy: z.enum(['asc', 'desc']),
});

export const Route = createFileRoute('/(menus)/assets/avatars/')({
  component: Avatars,
  validateSearch: (search) => {
    const result = searchParamsSchema.safeParse(search);
    if (!result.success) {
      return { page: 1, sortBy: 'createdAt', orderBy: 'asc' };
    }
    return result.data;
  },
});
