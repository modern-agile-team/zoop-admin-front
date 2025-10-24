import { Card, Space, Typography } from 'antd';

import { ROUTE_MENUS } from '@/shared/constant/routeMenus';
import { hasSubMenus } from '@/shared/utils/routeMenu';

const joinPath = (_base: string, child: string) => {
  let base = _base;
  if (!base) return child;
  if (!child || child === '/') return base;
  if (base.endsWith('/')) base = base.replace(/\/+$/, '');
  return `${base}${child}`;
};

export default function SiteMap() {
  const renderLinks = (menus: typeof ROUTE_MENUS, parentPath: string) => {
    return menus.map((m) => {
      const fullPath = joinPath(parentPath, m.path);
      if (hasSubMenus(m)) {
        return (
          <div key={`section:${fullPath}`} className="flex flex-col gap-1">
            <Typography.Text strong>{m.name}</Typography.Text>
            <div style={{ paddingLeft: 8 }}>
              <Space direction="vertical">
                {renderLinks(m.subMenus, fullPath)}
              </Space>
            </div>
          </div>
        );
      }
      return (
        <Typography.Link key={fullPath} href={fullPath}>
          {m.name}
        </Typography.Link>
      );
    });
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {ROUTE_MENUS.map((menu) => {
        return (
          <Card
            title={menu.name}
            key={menu.path}
            extra={hasSubMenus(menu) ? null : <a href={menu.path}>바로가기</a>}
          >
            {hasSubMenus(menu) ? (
              <Space direction="vertical">
                {renderLinks(menu.subMenus!, menu.path)}
              </Space>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
