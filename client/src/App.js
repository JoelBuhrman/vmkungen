import React, { Component } from 'react'
import './App.css'
import { Redirect } from 'react-router'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


import TablePage from './pages/table/tablePage'
import LoginPage from './pages/login/loginPage'






class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <div>
            <div>
                  <Switch>
                    <Route path="/table" component={TablePage} />
                    <LoginRoute path="/login" component={LoginPage} />

                    <Redirect to= "/login" component={LoginPage}/> 
              </Switch>
             
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

const checkAuth = () => {
  const token = localStorage.getItem('token')
  if(!token){
    return false
  }
}


const LoginRoute = (props) => (
  checkAuth() ? 
  <Redirect to= "/table" component={TablePage}/> : 
  <Route path={props.path} component={props.component}/>
)

export default App;
