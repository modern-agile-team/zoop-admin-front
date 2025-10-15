import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

import SiderMenu from '@/shared/components/SiderMenu';

export const Route = createFileRoute('/(menus)')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
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
  );
}
