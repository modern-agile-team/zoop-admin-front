import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { queryClient } from '@/lib/queryClient';
import SiderMenu from '@/shared/components/SiderMenu';

const Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout hasSider>
        <SiderMenu />
        <Layout>
          <Content>
            <div className="w-full h-full bg-white py-4 px-6">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <TanStackDevtools />
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
});
