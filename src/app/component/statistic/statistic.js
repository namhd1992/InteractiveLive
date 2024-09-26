import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import Service from "../../service/service";
import StorageManager from "../../ultils/storageManager";
import { useNavigate } from "react-router-dom";


class Statistic extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            isLoading:true,
            listAnswers:[]
		};
	}

    componentDidMount(){
        Service.getHistoryQuiz().then(v=>{
            if(v.code>0){
                this.setState({isLoading:false, listAnswers:v.data.userAnswers})
            }
        })
    }

    componentDidUpdate(){

    }

    componentWillUnmount(){

    }

    back=()=>{
        var gameid=StorageManager.getGameID()
        this.props.navigate(`/bxh?gameid=${gameid}`);
    }

    render(){
        const {listAnswers, isLoading}=this.state;
        console.log(listAnswers)

        if(isLoading){
            return (
                <div></div>
            )
        }

        return (
           <div style={{padding:"20px 100px"}}>
                <div>
                    <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.back}>Back</span>
                </div>
                <div style={{marginTop:20}}>
                        {listAnswers.length>0 && listAnswers.map((item, index) => (
                            <div key={index} style={{marginBottom:20}}>
                                <span style={{marginRight:5}}>{item.questionId}</span>
                                <span style={item.isCorrectAnswer?{backgroundColor:'green', color:'#fff', padding:'7px 15px'}:{backgroundColor:'red', color:'#fff', padding:'7px 15px'}}>{item.answerValue}</span>
                            </div>
                        ))}
                        
                </div>
               
           </div>
        )
    }

}


export default function (props) {
    const navigate = useNavigate();
  
    return <Statistic {...props} navigate={navigate} />;
}