import { Route, Switch } from 'react-router-dom';
import React from 'react'
import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss'
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';

function App() {
  return (
    <Switch>
      <PublicRoute path="/signin">
        <SignIn/>
      </PublicRoute>
      <PrivateRoute path="/">
        <Home/>
      </PrivateRoute>
      <Route>
        This page doesnot exist
      </Route>
    </Switch>
  );
}

export default App;
