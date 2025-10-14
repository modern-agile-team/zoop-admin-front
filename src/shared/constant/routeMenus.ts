interface RouteMenu {
  name: string;
  path: string;
  subMenus?: RouteMenu[];
}

export const ROUTE_MENUS: RouteMenu[] = [
  { name: '홈', path: '/' },
  {
    name: '퀴즈 관리',
    path: '/quizzes',
  },
  {
    name: '에셋 관리',
    path: '/assets',
    subMenus: [
      { name: 'BGM 관리', path: '/bgm' },
      { name: '효과음 관리', path: '/sfx' },
      { name: '이미지 관리', path: '/images' },
    ],
  },
];
