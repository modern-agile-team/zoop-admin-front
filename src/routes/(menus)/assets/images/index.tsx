import { createFileRoute } from '@tanstack/react-router';

import ImageAssetPage from '@/apps/assets/images';

export const Route = createFileRoute('/(menus)/assets/images/')({
  component: ImageAssetPage,
});
