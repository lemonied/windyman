interface Route {
  path: string;
  exact: boolean;
  component: () => Promise<any>;
}

export const routes: Route[] = [{
  path: '/example',
  exact: false,
  component: () => import('./views/examples')
}, {
  path: '/',
  exact: true,
  component: () => import('./views/home')
}];
