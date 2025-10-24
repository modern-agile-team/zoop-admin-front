import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(menus)/contents/nicknames')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(menus)/settings/nickname"!</div>;
}
