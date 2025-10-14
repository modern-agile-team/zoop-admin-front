import { Typography } from 'antd';

import SiteMap from './components/SiteMap';

export default function HomePage() {
  return (
    <div>
      <Typography.Title level={1}>Zoop 어드민</Typography.Title>

      <SiteMap />
    </div>
  );
}
