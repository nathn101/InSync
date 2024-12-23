import Navbar from './components/Navbar';
import Home from './components/Home';
import Match from './components/Match';
import Profile from './components/Profile';
import SignIn from './components/SigninForm';
import SignUp from './components/SignupForm';
import Match_profile from './components/Match_profile';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/Match">
              <Match />
            </Route>
            <Route exact path="/Profile">
              <Profile />
            </Route>
            <Route exact path="/SignIn">
              <SignIn />
            </Route>
            <Route exact path = "/SignUp">
              <SignUp />
            </Route>
            <Route exact path="/Match_profile/:username/:id">
              <Match_profile />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
