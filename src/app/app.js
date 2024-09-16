import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Statistic from "./component/statistic/statistic";
import Game from "./component/game/game";
import BXH from "./component/bxh/bxh";
import Start from "./component/start/start";


class App extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
		};
	}

    componentDidMount(){

    }

    componentDidUpdate(){

    }

    componentWillUnmount(){

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