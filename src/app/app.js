import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Statistic from "./component/statistic/statistic";
import Game from "./component/game/game";
import BXH from "./component/bxh/bxh";
import Start from "./component/start/start";
import Auth from "./auth/auth";
import AuthToken from "./auth/oauthtoken";
import StorageManager from "./ultils/storageManager";
import UltilsString from "./ultils/string_ultils";
import Service from "./service/service";


class App extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
		};
	}

    componentDidMount(){
        Auth.checkTimeout();
        var gameid=this.getInfoGame();
        StorageManager.setGameID(gameid)
        var infoUser=this.getInfoUser();
        if(Auth.isLogin()){
            Service.getInfoGameWithLogin().then(res=>{
                StorageManager.setAppsetting(res)
            });
        }else{
                Service.getInfoGameWithLogin().then(res=>{
                    if(res.code>0){
                        StorageManager.setAppsetting(res)
                        AuthToken.authToken(infoUser.auth_code, infoUser.grant_type_web);
                    }else{

                    }
                }).catch(error => {
                       console.log('error:', error)
                });
        }
    }

    componentDidUpdate(){

    }

    componentWillUnmount(){

    }
    
    getInfoUser=(type)=>{
        var auth_code=UltilsString.parse_query_string_playzone('access_token', window.location.href);
        auth_code=auth_code?auth_code:'VTNydHc2UU1pN0pNVzZPQUFEYUlhR25ON1RFVU5RdW4xQ3RPMGJIRm5ZUThvQ0hCNFVITnViZThtZWFtalhHZTh1emZFUE1tbk1kd1JyNTNzMHZ3YTFSdEFNalJaSHZBSDBrc1RodjQyb3VqQ3puR1BOK0h4MWJvR0V5NlNHQWtMbGFFNEFxR2tLaGZWSWJYQTZqYk5IeUdaTklLaDVUdnFtMkxPU255Sk50NG1ZaG5TRmM1MFU1d2VYc2h5Sk9sMUE3YzhuckNON1VUREM3emsyemtSUXo3bHlBK2dBZjFlRXlUYU1FMnlkNkZSWnFqNmYxMG05d3A1d1JOVHg5L1UyMVhkanFZRi8vTURjeHRjeFpNUzV4S2sxY2h1YVY1WjRraHpXMTlSSVU9'
        var grant_type_web='web:integration:auth_code';
        return {'auth_code':auth_code, 'grant_type_web':grant_type_web};
    }

    getInfoGame=()=>{
        var gameid=UltilsString.parse_query_string('gameid', window.location.href);
        return gameid;
    }

    

    render(){
        return (
            <div>
                <Start />
                <Router>
                    <Routes>
                        <Route path="/" element={<Game />} />
                        <Route path="statistic" element={<Statistic />} />
                        <Route path="bxh" element={<BXH />} />
                    </Routes>
                </Router>
            </div>
            
        )
    }

}

export default App;