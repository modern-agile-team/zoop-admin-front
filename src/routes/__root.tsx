import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router';
import { App as AntdAppProvider } from 'antd';

import { queryClient } from '@/lib/queryClient';
import { STORAGE } from '@/shared/utils/storage';

const Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AntdAppProvider>
        <Outlet />
      </AntdAppProvider>
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
