import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

import SiderMenu from '@/shared/components/SiderMenu';
import { STORAGE } from '@/shared/utils/storage';

export const Route = createFileRoute('/(menus)')({
  component: RouteComponent,
  loader: () => {
    if (!STORAGE.getAuthToken()) {
      throw redirect({
        to: '/login',
        search: { redirectUrl: encodeURIComponent(window.location.href) },
      });
    }
  },
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
