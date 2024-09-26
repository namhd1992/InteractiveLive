import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import {data_qs, data_aws, data_uaws, img} from "../../ultils/data";
import Service from "../../service/service";
import StorageManager from "../../ultils/storageManager";
import { useNavigate } from "react-router-dom";


class Quizs extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            horizontal:false,
            quizzes:{},
            questions:[],
            answers:[],
            embedTypes:[],
            settings:[],
            answersCurrentQuestion:[],
            userAnswer:[],
            currentQuestion:{},
            answersCurrentSelected:{},
            fontSizeDesktop: 18,
            fontSizeTablet: 16,
            fontSizeMobile: 14,
            haveImg:false,
            questionName:'',
            isNext:false,
            isBack:false,
            awsActive:0,
            isShowCheck:false,
            duration:0,
            showTimeStart:false,
            isStartGame:false,
            startTime:0,
            endTime:0,
            durationWaitStart:0,
            durationQuiz:"00:00:00",
            intervalQuiz:{},
            userAnswerStartStop:[]
		};
	}

    componentDidMount(){
        const {dataQuizs}=this.props;
        var t=Date.now();
        // this.renArr()
        var quizzes=dataQuizs.quizzes;
        var settings=dataQuizs.settings;
        var questions=dataQuizs.questions;
        var answers=dataQuizs.answers;
        var userAnswers_checkAction=dataQuizs.userAnswers ? dataQuizs.userAnswers : []; 
        var userAnswers=dataQuizs.userAnswers ? dataQuizs.userAnswers : [];
        userAnswers=userAnswers.filter((v)=>v.actionType===2);
        var userAnswerStartStop=userAnswers_checkAction.filter((v)=>v.actionType===1);
        var embedTypes=dataQuizs.embedTypes;

        this.setState({quizzes:quizzes, questions: questions, answers: answers, userAnswer: userAnswers, userAnswerStartStop:userAnswerStartStop, embedTypes:embedTypes, settings:settings}, ()=>{
            this.checkStartTime()
        })
        // this.setState({questions: data_qs, answers: data_aws, userAnswer: data_uaws}, ()=>{
        //     this.checkQuestionSelected();
        // })
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

    checkStartTime=()=>{
        const {quizzes,  userAnswer, userAnswerStartStop}=this.state;
        var gameid=StorageManager.getGameID()
        var _this=this;
        var t=Date.now()
        if(quizzes.startTime > t){
            var intervalWaitStart=setInterval(()=>{	
                _this.timeRemainWaitStart(quizzes.startTime)
            }, 1000);
            this.setState({showTimeStart:true, intervalWaitStart:intervalWaitStart})
        }

        if(t > quizzes.startTime &&  t < quizzes.endTime){ 
            if(userAnswerStartStop.length>0){
                if(userAnswerStartStop[0].stopEventTime > 163011600000){
                    this.props.navigate(`/bxh?gameid=${gameid}`);
                    return;
                }else{
                    this.setState({isStartGame:true},()=>{
                        this.checkQuestionSelected();
                    })
                }
            }else{
                this.setState({isStartGame:false})
            }
        }

        if(t > quizzes.endTime){
            alert("Game kết thúc")
        }
    }


    timeRemainWaitStart=(times)=>{
        const {intervalWaitStart}=this.state;
        var t=Date.now()
        var time=(times - t)/1000;
        if(time>0){
            var hour=Math.floor((time%86400)/3600) > 9 ? Math.floor((time%86400)/3600) : `0${Math.floor((time%86400)/3600)}`;
            var minute=Math.floor(((time%86400)%3600)/60) > 9 ? Math.floor(((time%86400)%3600)/60) : `0${Math.floor(((time%86400)%3600)/60)}`;
            var second=Math.floor(((time%86400)%3600)%60) > 9 ? Math.floor(((time%86400)%3600)%60) : `0${Math.floor(((time%86400)%3600)%60)}`;
            var time_wait_start=`${hour}:${minute}:${second}`;
            this.setState({durationWaitStart: time_wait_start})
        }else{
            this.setState({isStartGame:true, showTimeStart:false},()=>{
                clearInterval(intervalWaitStart)
            });
        }
	}

    timeRemainQuiz=(times)=>{
        var t=Date.now()
        var time=(times - t)/1000;
        if(time>0){
            var hour=Math.floor((time%86400)/3600) > 9 ? Math.floor((time%86400)/3600) : `0${Math.floor((time%86400)/3600)}`;
            var minute=Math.floor(((time%86400)%3600)/60) > 9 ? Math.floor(((time%86400)%3600)/60) : `0${Math.floor(((time%86400)%3600)/60)}`;
            var second=Math.floor(((time%86400)%3600)%60) > 9 ? Math.floor(((time%86400)%3600)%60) : `0${Math.floor(((time%86400)%3600)%60)}`;
            var time_end_quiz=`${hour}:${minute}:${second}`;
            this.setState({durationQuiz: time_end_quiz});
        }else{
            this.finished();
        }
	}


    

    checkQuestionSelected=()=>{
        const {questions, answers, userAnswer, isBack, isNext}=this.state;
        var len=userAnswer.length;
        var awsActive=0;
        var currentQuestion={};
        if(len>0){
            if(isBack || isNext){
                currentQuestion=this.state.currentQuestion;
            }else{
                if(len < questions.length-1){
                    currentQuestion=questions[len+1];
                }else{
                    currentQuestion=questions[len-1];
                }
            }
           
        }else{
            currentQuestion=questions[0];
        }
        var questionId=currentQuestion.id;
        var pos = userAnswer.map(function(e) { return e.questionId; }).indexOf(questionId);
        if(pos!==-1){
            awsActive=userAnswer[pos].answerId;
        }
        var answersCurrentQuestion=this.getListAnswerByQuestionId(questionId);
        this.setState({currentQuestion:currentQuestion, answersCurrentQuestion:answersCurrentQuestion, awsActive:awsActive, isBack:false, isNext:false, duration:currentQuestion.duration})
    }

    getListAnswerByQuestionId=(questionId)=>{
        const {answers}=this.state;
        var list=[]
        for (let i = 0; i < answers.length; i++) {
            if (questionId===answers[i].questionId) {
                list.push(answers[i])
            }
        }
        return list;
    }

    next=(key)=>{
        const {currentQuestion, questions, awsActive, userAnswer, answersCurrentSelected}=this.state;
        var pos = questions.map(function(e) { return e.id; }).indexOf(currentQuestion.id);
        var pos_awsu = userAnswer.map(function(e) { return e.questionId; }).indexOf(currentQuestion.id);
        var newUserAnswer=[...userAnswer];
        var itemUserAnswer={};
        if(awsActive===0){
            alert('Bạn chưa chọn đáp án!')
            return;
        }
        if(pos_awsu !==-1){
            if(userAnswer[pos_awsu].answerId !==answersCurrentSelected.id){
                newUserAnswer.splice(pos_awsu,1)
                itemUserAnswer.id=userAnswer[pos_awsu].id;
                itemUserAnswer.answerId=answersCurrentSelected.id;
                itemUserAnswer.questionId=answersCurrentSelected.questionId;
                itemUserAnswer.answerValue=answersCurrentSelected.content;
                newUserAnswer.push(itemUserAnswer);
            }
        }else{
            itemUserAnswer.id=questions[pos].id;
            itemUserAnswer.answerId=answersCurrentSelected.id;
            itemUserAnswer.questionId=answersCurrentSelected.questionId;
            itemUserAnswer.answerValue=answersCurrentSelected.content;
            newUserAnswer.push(itemUserAnswer);
        }

        

        if(pos<questions.length-1){
            var gameid=StorageManager.getGameID()
            var data={
                "quizId": +gameid,
                "questionId": currentQuestion.id,
                "answerId": awsActive
            }
            Service.answersQuestion(data).then(v=>{
                if(v.code>0){
                    this.setState({currentQuestion:questions[pos+1], userAnswer:newUserAnswer, isNext:true}, ()=>{
                        this.checkQuestionSelected();
                    });
                }
            })
        }
        
    }

    back=()=>{
        const {currentQuestion, questions}=this.state;
        var pos = questions.map(function(e) { return e.id; }).indexOf(currentQuestion.id);
        if(pos>0){
            this.setState({currentQuestion:questions[pos-1], isBack:true},()=>{
                this.checkQuestionSelected();
            });
        }
        
    }

    finished=()=>{
        const {intervalQuiz}=this.state;
        var gameid=StorageManager.getGameID()
        var data={
            "quizId":+gameid
        }
        clearInterval(intervalQuiz)
        Service.finishedQuiz(data).then(v=>{
            if(v.code>0){
                this.props.navigate(`/bxh?gameid=${gameid}`);
            }
        })
    }

    selectAnswer=(item)=>{
        this.setState({awsActive:item.id, answersCurrentSelected:item})
    }


    randomInteger=(min, max)=> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    startQuizs=()=>{
        const {quizzes}=this.state;

        var gameid=StorageManager.getGameID()
        var data={
            "quizId":+gameid
        }
        var intervalQuiz=setInterval(()=>{	
            this.timeRemainQuiz(quizzes.endTime)
        }, 1000);
        Service.startQuiz(data).then(v=>{
            if(v.code>0){
                this.setState({isStartGame:true, intervalQuiz:intervalQuiz},()=>{
                    this.checkQuestionSelected();
                })
            }
        })
    }


    render(){
        const {currentQuestion, awsActive, isBack, isNext, answersCurrentQuestion, showTimeStart, isStartGame, durationWaitStart, durationQuiz}=this.state;

        if(showTimeStart){
            return (<div style={{display:'flex', justifyContent:'center'}}>
                <span style={{fontSize:20, fontWeight:'bold'}}>{durationWaitStart}</span>
            </div>)
        }
        if(!isStartGame){
            return (<div style={{display:'flex', justifyContent:'center'}}>
                        <span style={{fontSize:20, marginTop:50, cursor:'pointer', backgroundColor:'green', padding:'8px 10px', color:'#fff'}} onClick={this.startQuizs}>Bắt Đầu</span>
                </div>)
        }

        return (
           <div style={{display:'flex', flexDirection:'column'}}>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <span style={{fontSize:20, fontWeight:'bold'}}>{durationQuiz}</span>
                </div>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div>
                        {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} width="50%"></img>}
                        <p>{currentQuestion.name}</p>
                    </div>
                    <div id="answer" style={{display:'flex',flexDirection:'row', marginBottom:20}}>
                        {answersCurrentQuestion.length>0 && answersCurrentQuestion.map((item, index) => (
                            <div key={index}>
                                <span style={item.id===awsActive ? {backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}:{backgroundColor:'gray', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'} } onClick={()=>this.selectAnswer(item)}>{item.content}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div>
                            <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.back}>Back</span>
                        </div>
                        <div>
                            <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={()=>this.next()} >Next</span>
                        </div>
                        <div>
                            <span style={{backgroundColor:'red', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.finished}>Kết thúc ngay</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}


export default function (props) {
    const navigate = useNavigate();
    return <Quizs {...props} navigate={navigate} />;
}