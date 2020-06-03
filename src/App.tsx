import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AsyncLoad } from './components/async-load';
import { routes } from './routes';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {
          routes.map(item => (
            <Route exact={item.exact} path={item.path} key={item.path}>
              <AsyncLoad load={item.component}/>
            </Route>
          ))
        }
      </Switch>
    </BrowserRouter>
  );
}

export default App;
