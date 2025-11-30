import { createFileRoute } from '@tanstack/react-router';

import EditAvatar from '@/apps/assets/avatars/components/EditAvatar';

export const Route = createFileRoute('/(menus)/assets/avatars/$id/edit/')({
  component: EditAvatar,
});
