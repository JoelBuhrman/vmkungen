import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'
import Row from './Row'

class TablePage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      user: '',
      games: [],
    }

    this.renderGames = this.renderGames.bind(this)
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
           fetch('/api/getGames/'+user[0].name)
            .then(res => res.json())
            .then(games => {
              this.setState({
                games: games
              })
            })
        })
      }
  }

  renderGames(){
    return this.state.games.map(game => <Row game={game}/>)
  }


  render() {
    return (
      <div>
        {this.state.redirecter}
        Welcome {this.state.user}
        {this.renderGames()}
      </div>
    );
  }
}

export default TablePage;
