import { Link } from '@tanstack/react-router';
import { Card, Tree, type TreeProps } from 'antd';

import { ROUTE_MENUS } from '@/shared/constant/routeMenus';
import { hasSubMenus } from '@/shared/utils/routeMenu';

const joinPath = (_base: string, child: string) => {
  let base = _base;
  if (!base) return child;
  if (!child || child === '/') return base;
  if (base.endsWith('/')) base = base.replace(/\/+$/, '');
  return `${base}${child}`;
};

type TreeItem = NonNullable<TreeProps['treeData']>[number];

const buildTreeData = (
  menus: typeof ROUTE_MENUS,
  parentPath = ''
): TreeItem[] => {
  return menus.map<TreeItem>((m) => {
    const fullPath = joinPath(parentPath, m.path);
    if (hasSubMenus(m)) {
      return {
        key: `section:${fullPath}`,
        title: m.name,
        children: buildTreeData(m.subMenus!, fullPath),
      };
    }
    return {
      key: fullPath,
      title: <Link to={fullPath}>{m.name}</Link>,
      isLeaf: true,
    };
  });
};

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
            <Tree
              showLine
              treeData={buildTreeData(menu.subMenus ?? [], menu.path)}
            />
          </Card>
        );
      })}
    </div>
  );
}
