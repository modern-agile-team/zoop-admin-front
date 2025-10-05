import { Outlet, createRootRoute } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import { TanStackDevtools } from '@tanstack/react-devtools';

const Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <TanStackDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
});
