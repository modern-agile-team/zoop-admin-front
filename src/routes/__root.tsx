import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';

import { queryClient } from '@/lib/queryClient';

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
