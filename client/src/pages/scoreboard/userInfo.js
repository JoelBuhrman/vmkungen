import React, { Component } from 'react'
import Row from '../table/Row'



class UserInfo extends Component {


	constructor(props){
		super(props)
		this.state={
			games: []
		}

		this.renderInfo = this.renderInfo.bind(this)
		this.renderGames = this.renderGames.bind(this)
	}



	renderGames(){
    	return this.state.games.map(game => game.locked === 1 && <Row game={game} user={this.props.name} notThisUser/>)
	}

	renderInfo(){
		return (
			<div className="userInfo">
				<div className="usersGuesses">
					{this.props.name} 's guesses
					<i class="far fa-times-circle" onClick={this.props.deActivate}/>
					<div className="guesses">
						{this.renderGames()}
					</div>	
				</div>
				
			</div>)
	}


	componentWillMount(){
			fetch('/api/getGames/'+this.props.name)
            .then(res => res.json())
            .then(games => {
              this.setState({
                games: games
              })
            })
	}



	render() {
	    return (
	      <div className={this.props.active ? "dark" : ""}>

	      	{this.props.active && this.renderInfo()}
	      	{this.renderGames}
	      </div>
	    );	
	 }
}

export default UserInfo;
