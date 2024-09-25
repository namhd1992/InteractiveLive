import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import {data_qs, data_aws, data_uaws, img} from "../../ultils/data";
import Service from "../../service/service";
import StorageManager from "../../ultils/storageManager";


class QuizsViewAnswer extends React.Component{

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
            duration:0
		};
	}

    componentDidMount(){
        // this.renArr()
        Service.getInfoQuiz().then((v)=>{
            if(v.code>0){
                var quizzes=v.data.quizzes;
                var settings=v.data.settings;
                var questions=v.data.questions;
                var answers=v.data.answers;
                answers.map(v=>v.colorAnswer='gray')
                var userAnswers=v.data.userAnswers ? v.data.userAnswers : [];
                var embedTypes=v.data.embedTypes;

                this.setState({quizzes:quizzes, questions: questions, answers: answers, userAnswer: userAnswers, embedTypes:embedTypes, settings:settings}, ()=>{
                    this.checkQuestionSelected();
                })

            }else{
                this.setState({quizzes: {}, questions: data_qs, answers: data_aws, userAnswer: data_uaws, embedTypes:[], settings:[], }, ()=>{
                    this.checkQuestionSelected();
                })
            }
        })
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
        this.setState({currentQuestion:currentQuestion, answersCurrentQuestion:answersCurrentQuestion, awsActive:awsActive, isBack:false, isNext:false, duration:currentQuestion.duration},()=>{
            this.setTime();
        })
    }

    setTime=()=>{

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

    next=()=>{
        const {currentQuestion, questions, awsActive, userAnswer, answersCurrentSelected}=this.state;
        var pos = questions.map(function(e) { return e.id; }).indexOf(currentQuestion.id);

        if(pos<questions.length-1){
            this.setState({currentQuestion:questions[pos+1], isNext:true}, ()=>{
                this.checkQuestionSelected();
            });
        }else{
            var gameid=StorageManager.getGameID()
            var data={
                "quizId":+gameid
            }
            Service.finishedQuiz(data).then(v=>{
                if(v.code>0){
                    this.props.navigate(`/bxh?gameid=${gameid}`);
                }
            })
        }
        
    }

    selectAnswer=(item)=>{
        const {currentQuestion, questions, awsActive, userAnswer, answersCurrentSelected, answersCurrentQuestion}=this.state;
        var newAnswersCurrentQuestion=[...answersCurrentQuestion];
        var pos = newAnswersCurrentQuestion.map(function(e) { return e.id; }).indexOf(item.id);
        var gameid=StorageManager.getGameID()
        var data={
            "quizId": +gameid,
            "questionId": currentQuestion.id,
            "answerId": item.id
        }
        Service.answersQuestion(data).then(v=>{
            if(v.code>0){
                var data=v.data;
                if(data.isCorrectAnswer){
                    newAnswersCurrentQuestion[pos].colorAnswer='green';
                    this.setState({answersCurrentQuestion:newAnswersCurrentQuestion})
                }else{
                    var answerCorrect=data.answerCorrect;
                    var idCorrectAnswer=answerCorrect.substring(answerCorrect.indexOf('-')+1);
                    var pos_correctAnswer = newAnswersCurrentQuestion.map(function(e) { return e.id; }).indexOf(+idCorrectAnswer);
                    newAnswersCurrentQuestion[pos].colorAnswer='red';
                    newAnswersCurrentQuestion[pos_correctAnswer].colorAnswer='green';
                    this.setState({answersCurrentQuestion:newAnswersCurrentQuestion})
                }
            }else{

            }
        })
    }

    randomInteger=(min, max)=> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    render(){
        const {currentQuestion, awsActive, isBack, isNext, answersCurrentQuestion}=this.state;
        return (
           <div style={{display:'flex', flexDirection:'row'}}>
                <div style={{display:'flex', alignContent:'center'}}>{currentQuestion.duration}</div>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div>
                        {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} width="50%"></img>}
                        <p>{currentQuestion.name}</p>
                    </div>
                    <div id="answer" style={{display:'flex',flexDirection:'row', marginBottom:20}}>
                        {answersCurrentQuestion.length>0 && answersCurrentQuestion.map((item, index) => (
                            <div key={index}>
                                <span style={{backgroundColor:item.colorAnswer, color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={()=>this.selectAnswer(item)}>{item.content}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div>
                            <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.next} >Next</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default QuizsViewAnswer;