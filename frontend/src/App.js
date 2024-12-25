import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Match from './components/Match';
import Profile from './components/Profile';
import SignIn from './components/SigninForm';
import SignUp from './components/SignupForm';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import About from './components/About';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('token') ? (
                <Component {...props} />
            ) : (
                <Redirect to="/SignIn" />
            )
        }
    />
);

function App() {
  return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
            <Switch>
              <Route exact path="/Home">
                <Home />
              </Route>
              <Route exact path="/SignIn">
                <SignIn />
              </Route>
              <Route exact path = "/SignUp">
                <SignUp />
              </Route>
              <Route exact path = "/ForgotPassword">
                <ForgotPassword />
              </Route>
              <Route exact path="/About">
                <About />
              </Route>
              <PrivateRoute exact path="/Dashboard" component={Dashboard} />
              <PrivateRoute exact path="/Profile" component={Profile} />
              <PrivateRoute exact path="/Match" component={Match} />
              {/* <Route exact path="/Match_profile/:username/:id">
                <Match_profile />
              </Route> */}
              <Redirect from="/" to="/Home" />
            </Switch>
          </div>
        </div>
      </Router>
  );
}

export default App;
