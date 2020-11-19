import React from 'react';
import './App.css';
import Landing from './Landing';
import Profile from './Profile';
import Dashboard from './Dashboard';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';


function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Landing}/>
          <Route path="/profile" component={Profile}/>
          <Route path="/dashboard" component={Dashboard}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
