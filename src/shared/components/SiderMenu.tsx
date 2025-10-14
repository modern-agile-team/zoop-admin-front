import { Link, useRouterState } from '@tanstack/react-router';
import { Menu, type MenuProps } from 'antd';
import Sider from 'antd/es/layout/Sider';

import { ROUTE_MENUS } from '@/shared/constant/routeMenus';

const hasSubMenus = (
  menu: (typeof ROUTE_MENUS)[number]
): menu is Required<(typeof ROUTE_MENUS)[number]> =>
  Boolean(menu.subMenus && menu.subMenus.length > 0);

const items = ROUTE_MENUS.map((menu) => {
  const parentPath = menu.path;

  if (hasSubMenus(menu)) {
    const children: NonNullable<MenuProps['items']>[number][] =
      menu.subMenus.map((sub) => {
        const subPath = sub.path;
        return {
          key: subPath,
          label: <Link to={`${parentPath}${subPath}`}>{sub.name}</Link>,
        };
      });

    return { key: parentPath, label: menu.name, children };
  }

  return { key: parentPath, label: <Link to={parentPath}>{menu.name}</Link> };
});

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
