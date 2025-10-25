import { createFileRoute } from '@tanstack/react-router';

import NicknameListPage from '@/apps/contents/nicknames';

export const Route = createFileRoute('/(menus)/contents/nicknames/')({
  component: NicknameListPage,
});
