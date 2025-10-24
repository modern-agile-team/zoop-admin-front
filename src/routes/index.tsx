import { createFileRoute } from '@tanstack/react-router';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

import HomePage from '@/apps/home';
import SiderMenu from '@/shared/components/SiderMenu';

const HomeComponent = () => {
  return (
    <Layout hasSider>
      <SiderMenu />
      <Layout>
        <Content>
          <div className="w-full h-full py-4 px-6">
            <HomePage />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
