import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect"


class Game extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            horizontal:false,
		};
	}

    componentDidMount(){
        if(window.innerWidth < window.innerHeight){
			this.setState({horizontal: false})
		}else{
			this.setState({horizontal: true})
		}

    }

    componentDidUpdate(){

    }

    componentWillUnmount(){

    }

    render(){
        return (
           <div style={{display:'flex', flexDirection:'column'}}>
                <div>30</div>
                <div style={{flexDirection:'row'}}>
                    <div>
                        <p>Câu:1 Đâu là viết đúng từ CS2?</p>
                    </div>
                    <div style={{flexDirection:'column'}}>
                        <div>
                            <p>Đáp án 1</p>
                        </div>
                        <div>
                            <p>Đáp án 2</p>
                        </div>
                        <div>
                            <p>Đáp án 3</p>
                        </div>
                        <div>
                            <p>Đáp án 4</p>
                        </div>
                    </div>
                    <div style={{flexDirection:'column'}}>
                        <div>
                            <span>Back</span>
                        </div>
                        <div>
                            <span>Next</span>
                        </div>
                        <div>
                            <span>Kết thúc ngay</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Game;