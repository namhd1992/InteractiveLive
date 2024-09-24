import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import {data_qs, data_aws, data_uaws, img} from "../../ultils/data";
import Service from "../../service/service";
import Quizs from "./quizs";
import QuizsViewAnswer from "./quizsViewAnswer";


class Game extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            horizontal:false,
            dataQuizs:{},
            isShowAnswers:false,
            isLoading:true

		};
	}

    componentDidMount(){
        // this.renArr()
        Service.getInfoQuiz().then((v)=>{
            if(v.code>0){
                var dataQuizs=v.data;
                var quizzes=dataQuizs.quizzes;
                var isShowAnswers=quizzes.isShowAnswers;
                this.setState({isLoading:false, dataQuizs: dataQuizs, isShowAnswers:isShowAnswers})
            }
          
        })
        if(window.innerWidth < window.innerHeight){
			this.setState({horizontal: false})
		}else{
			this.setState({horizontal: true})
		}

    }
   

    render(){
        const {dataQuizs, isShowAnswers, isLoading}=this.state;

        if(isLoading){
            return <div></div>
        }

        return (<div>
                {(!isShowAnswers)?(<QuizsViewAnswer dataQuizs={dataQuizs}></QuizsViewAnswer>):(<Quizs dataQuizs={dataQuizs}></Quizs>)}
            </div>
        )
    }

}

export default Game;