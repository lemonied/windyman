interface Route {
  path: string;
  exact: boolean;
  component: () => Promise<any>;
}

export const routes: Route[] = [{
  path: '/',
  exact: true,
  component: () => import('./views/home')
}];
