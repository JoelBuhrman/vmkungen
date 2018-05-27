import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'
import Row from './Row'

class TablePage extends Component {

  constructor(props){
    super(props)
    this.state={
      redirecter: '',
      updating: false,
      user: '',
      games: [],
      message: '',
    }

    this.renderGames = this.renderGames.bind(this)
    this.generateLoadBar = this.generateLoadBar.bind(this)
    this.setUpdate = this.setUpdate.bind(this)
    this.generateLoadBar = this.generateLoadBar.bind(this)
    this.closeMessage = this.closeMessage.bind(this)
    this.scrollDown = this.scrollDown.bind(this)
    this.getFirstActiveGame = this.getFirstActiveGame.bind(this)
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
              this.scrollDown()
            })
        })
      }
  }

  renderGames(){
    return this.state.games.map(game => <Row game={game} user={this.state.user} setUpdate={this.setUpdate} />)
  }

   generateLoadBar(){
    return(
      <div>
        Updating guesses <br/>
        <i class="fas fa-spinner"></i>
      </div>
    )
  }

  closeMessage(){
    this.setState({
        message: ''
    })  
  }

  setUpdate(state, status){
     
     this.setState({
        updating: state
     })  
     if(!state){
        this.setState({
          message: status ? 'Update was succesful' : 'Updating guesses failed, please reload page'
        })
        setTimeout(function(){
             this.setState({message:''});
        }.bind(this),1000);  
     }
  }

  getFirstActiveGame(){
    for(let i = 0; i<this.state.games.length; i++){
      if(this.state.games[i].active === 1){
        return i
      }
    }
    return 0
  }

  scrollDown(){
    if(document.getElementById("row"+this.state.games[0].hometeam+this.state.games[0].awayteam)){
      const rowHeight = document.getElementById("row"+this.state.games[0].hometeam+this.state.games[0].awayteam).clientHeight
      const index = this.getFirstActiveGame()

      document.getElementById("rowsContainer").scrollBy(0, rowHeight*index)
    }
  }

  render() {
    return (
      <div>
        <div className="rowsContainer" id="rowsContainer">
          {this.state.redirecter}
          {this.renderGames()}
        </div>
           {this.state.updating && this.generateLoadBar()}
          {this.state.message}
      </div>
    );
  }
}

export default TablePage;
