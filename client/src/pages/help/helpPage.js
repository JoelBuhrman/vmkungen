import React, { Component } from 'react'
import { Redirect } from 'react-router'
import LoginPage from '../login/loginPage'


class HelpPage extends Component {


	constructor(props){
		super(props)
		
	}

	componentWillMount(){
		 if(!localStorage.getItem('token')){
          this.setState({
            redirecter: <Redirect to="/login" component={LoginPage} />  
          })
      }
      
	}

	

	render() {
	    return (
	      <div className="help">
	      	Welcome to VM Kungen.<br/><br/>
	      	The aim of this game is to guess every world cup match as accurately as possible.<br/>
	      	Points are given according to how close to the actual result you guess.<br/><br/>
	      	1p- For guessing the correct 1X2 outcome of a match<br/>
	      	1p- For guessing the correct number of goals for the home team<br/>
	      	1p- For guessing the correct number of goals for the away team<br/>
	      	1p- For guessing the correct score<br/><br/>
	      	So the maximum amount of points for each match is 4p.<br/><br/>
	      	Only matches for one match day will be open for guesses at the same time.<br/>
	      	The guesses for a match day is locked at 10AM Swedish time the day before the match. <br/>
	      	At the same time, the guessing for the next match day opens.<br/>
	      	If you haven't submitted your guesses in time, the games will be automatically guessed 0-0.<br/><br/>
	      	Any questions or feedback?<br/>
	      	E-mail at <a className="email" href="mailto:info@vmkungen.se?Subject=Feedback%20vmkungen" target="_top">info@vmkungen.se</a>

	      </div>
	    );	
	 }
}

export default HelpPage;
