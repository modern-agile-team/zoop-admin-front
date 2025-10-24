import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  createRootRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import { App as AntdAppProvider, Button, ConfigProvider, theme } from 'antd';
import { OverlayProvider } from 'overlay-kit';
import { useMemo, useState } from 'react';

import { queryClient } from '@/lib/queryClient';
import { STORAGE } from '@/shared/utils/storage';

const Component = () => {
  const location = useLocation();
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (STORAGE.getThemeMode() as 'light' | 'dark') || 'light'
  );

  const algorithm = useMemo(() => {
    if (location.pathname === '/login') {
      return theme.defaultAlgorithm;
    }
    return mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;
  }, [mode, location.pathname]);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    STORAGE.changeThemeMode(next);
    setMode(next);
  };

  return (
    <ConfigProvider theme={{ algorithm }}>
      <QueryClientProvider client={queryClient}>
        <OverlayProvider key={location.url}>
          <AntdAppProvider>
            {location.pathname !== '/login' && (
              <Button
                type="default"
                aria-label="toggle-theme"
                onClick={toggleTheme}
                icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                style={{ position: 'fixed', right: 16, top: 16, zIndex: 1000 }}
              />
            )}
            <Outlet />
          </AntdAppProvider>
        </OverlayProvider>
        <TanStackDevtools />
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export const Route = createRootRoute({
  component: Component,
  loader: (ctx) => {
    const isLoginRoute = ctx.location.pathname === '/login';
    if (!isLoginRoute && !STORAGE.getAuthToken()) {
      throw redirect({
        to: '/login',
        search: { redirectUrl: ctx.location.href },
      });
    }
  },
});
