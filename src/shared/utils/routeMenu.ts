import type { RouteMenu } from '../constant/routeMenus';

export const hasSubMenus = (menu: RouteMenu): menu is Required<RouteMenu> =>
  Boolean(menu.subMenus && menu.subMenus.length > 0);
