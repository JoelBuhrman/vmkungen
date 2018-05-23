import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'

class TablePage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      user: '',
    }
  }


  componentWillMount(){
      if(!localStorage.getItem('token')){
          this.setState({
            redirecter: <Redirect to="/login" component={LoginPage} />  
          })
      }
      else{
       fetch('/api/checkToken/'+localStorage.getItem('token'))
        .then(res => res.json())
        .then(user => {
          this.setState({
            user: user[0].name,
          })
        })
      }
  }


  render() {
    return (
      <div>
        {this.state.redirecter}
        Welcome {this.state.user}
      </div>
    );
  }
}

export default TablePage;
