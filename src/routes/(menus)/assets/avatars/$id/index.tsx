import { createFileRoute } from '@tanstack/react-router';

import SingleAvatar from '@/apps/assets/avatars/components/SingleAvatar';

export const Route = createFileRoute('/(menus)/assets/avatars/$id/')({
  component: SingleAvatar,
});
