import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  createRootRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import { OverlayProvider } from 'overlay-kit';

import { queryClient } from '@/lib/queryClient';
import { STORAGE } from '@/shared/utils/storage';

const Component = () => {
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider key={location.url}>
        <Outlet />
      </OverlayProvider>
      <TanStackDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
  loader: (ctx) => {
    const isLoginRoute = ctx.location.pathname === '/login';
    if (!isLoginRoute && !STORAGE.getAuthToken()) {
      throw redirect({
        to: '/login',
        search: { redirectUrl: ctx.location.href },
      });
    }
  },
});
