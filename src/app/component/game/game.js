import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import {data_qs, data_aws, data_uaws, img} from "../../ultils/data";


class Game extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            horizontal:false,
            questions:[],
            answers:[],
            answersCurrentQuestion:[],
            userAnswer:[],
            currentQuestion:{},
            answersCurrentSelected:{},
            fontSizeDesktop: 18,
            fontSizeTablet: 16,
            fontSizeMobile: 14,
            haveImg:false,
            questionName:'',
            isNext:true,
            isBack:false,
            awsActive:0,
            isShowCheck:false

		};
	}

    componentDidMount(){
        // this.renArr()
        this.setState({questions: data_qs, answers: data_aws, userAnswer: data_uaws}, ()=>{
            this.checkQuestionSelected();
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
                if(len!==questions.length){
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
        this.setState({currentQuestion:currentQuestion, answersCurrentQuestion:answersCurrentQuestion, awsActive:awsActive, isBack:false, isNext:false})
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
            this.setState({currentQuestion:questions[pos+1], userAnswer:newUserAnswer, isNext:true}, ()=>{
                this.checkQuestionSelected();
            });
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

    }

    selectAnswer=(item)=>{
        this.setState({awsActive:item.id, answersCurrentSelected:item})
    }

    renArr=()=>{
        var list_qs=[];
        var list_aws=[];
        var list_uaws=[];
        for (let i = 1; i < 31; i++) {
            var numberAnswer=this.randomInteger(2,6);
            
            var numberUserAnswer=this.randomInteger(0,numberAnswer-1);
            console.log('numberAnswer: ',numberAnswer,' numberUserAnswer:', numberUserAnswer)
            var qs={};
            
            qs.id=i;
            
            if(numberAnswer>4){
                qs.name=`Câu ${i}: Đây là game nào`;
                qs.imageUrl=img[this.randomInteger(0, img.length-1)]
            }else{
                qs.name=`Câu ${i}: Nội dung câu hỏi số ${i}`;
                qs.imageUrl="";
            }
            qs.duration=30;
            list_qs.push(qs);
            var arr_aws=[];

            for (let j = 1; j < numberAnswer+1; j++) {
                var aws={};
                aws.id=j;
                aws.questionId=i;
                aws.content=`Đáp án ${j}`;
                arr_aws.push(aws);
                list_aws.push(aws);
                // aws.push(`Đáp án ${j}`)
            }
            var uaws={};
            uaws.id=i;
            uaws.questionId=i;
            uaws.answerId=arr_aws[numberUserAnswer].id;
            uaws.answerValue=arr_aws[numberUserAnswer].content;
            list_uaws.push(uaws)

            // qs.answers=aws;
           
        }
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
                                <span style={item.id===awsActive ? {backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}:{backgroundColor:'gray', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'} } onClick={()=>this.selectAnswer(item)}>{item.content}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{display:'flex',flexDirection:'row'}}>
                        <div>
                            <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.back}>Back</span>
                        </div>
                        <div>
                            <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.next} >Next</span>
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

export default Game;