import { Card, Space, Typography } from 'antd';

import { ROUTE_MENUS } from '@/shared/constant/routeMenus';
import { hasSubMenus } from '@/shared/utils/routeMenu';

export default function SiteMap() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {ROUTE_MENUS.map((menu) => {
        return (
          <Card
            title={menu.name}
            key={menu.path}
            extra={hasSubMenus(menu) ? null : <a href={menu.path}>바로가기</a>}
          >
            <Space direction="vertical">
              {menu.subMenus?.map((subMenu) => (
                <Typography.Link
                  key={`${menu.path}${subMenu.path}`}
                  href={`${menu.path}${subMenu.path}`}
                >
                  {subMenu.name}
                </Typography.Link>
              ))}
            </Space>
          </Card>
        );
      })}
    </div>
  );
}
