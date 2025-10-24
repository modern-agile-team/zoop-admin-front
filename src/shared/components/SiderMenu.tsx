import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';

import { ROUTE_MENUS, type RouteMenu } from '@/shared/constant/routeMenus';

import { hasSubMenus } from '../utils/routeMenu';

type ItemType = NonNullable<MenuProps['items']>[number];

const joinPath = (_base: string, child: string) => {
  let base = _base;

  if (!base) {
    return child;
  }
  if (!child || child === '/') {
    return base;
  }
  if (base.endsWith('/')) {
    base = base.replace(/\/+$/, '');
  }

  return `${base}${child}`;
};

const buildMenuItems = (menus: RouteMenu[], parentPath = ''): ItemType[] => {
  return menus.map<ItemType>((menu) => {
    const fullPath = joinPath(parentPath, menu.path);

    if (hasSubMenus(menu)) {
      const children = buildMenuItems(menu.subMenus, fullPath);
      return { key: `section:${fullPath}`, label: menu.name, children };
    }

    return { key: fullPath, label: <Link to={fullPath}>{menu.name}</Link> };
  });
};

const items = buildMenuItems(ROUTE_MENUS);

export default function SiderMenu() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    <Sider
      theme="light"
      width={240}
      className="h-screen overflow-auto sticky top-0 bottom-0 shadow"
    >
      <Menu mode="inline" items={items} defaultSelectedKeys={[pathname]} />
    </Sider>
  );
}
