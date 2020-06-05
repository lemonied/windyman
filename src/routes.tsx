interface Route {
  path: string;
  exact: boolean;
  component: () => Promise<any>;
}

export const routes: Route[] = [{
  path: '/user',
  exact: true,
  component: () => import('./views/user')
}, {
  path: '/example',
  exact: true,
  component: () => import('./views/examples')
}, {
  path: '/',
  exact: true,
  component: () => import('./views/home')
}];
