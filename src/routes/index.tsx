import { createFileRoute } from '@tanstack/react-router';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';

import HomePage from '@/apps/home';
import SiderMenu from '@/shared/components/SiderMenu';

const HomComponent = () => {
  return (
    <Layout hasSider>
      <SiderMenu />
      <Layout>
        <Content>
          <div className="w-full h-full bg-white py-4 px-6">
            <HomePage />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export const Route = createFileRoute('/')({
  component: HomComponent,
});
