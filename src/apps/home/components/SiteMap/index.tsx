import { Link } from '@tanstack/react-router';
import { Card, Col, Row, Tree, type TreeProps } from 'antd';

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
    <Row gutter={[16, 16]}>
      {ROUTE_MENUS.map((menu) => {
        return (
          <Col
            key={menu.path}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 12 }}
            xl={{ span: 6 }}
          >
            <Card
              title={menu.name}
              extra={
                hasSubMenus(menu) ? null : <a href={menu.path}>바로가기</a>
              }
              className="h-full"
            >
              <Tree
                showLine
                treeData={buildTreeData(menu.subMenus ?? [], menu.path)}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
