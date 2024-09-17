import React from "react";
import {isMobile, isDesktop, isTablet} from "react-device-detect";
import {data, img} from "../../ultils/data";


class Game extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            horizontal:false,
            questions:[],
            currentQuestion:{},
            fontSizeDesktop: 18,
            fontSizeTablet: 16,
            fontSizeMobile: 14,
            haveImg:false,
            questionName:'',
            isNext:true,
            isBack:false,
            awsActive:''

		};
	}

    componentDidMount(){
        // this.renArr()
        this.setState({questions: data, currentQuestion:data[0]})
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

    next=()=>{
        const {currentQuestion, questions}=this.state;
        var pos = questions.map(function(e) { return e.id; }).indexOf(currentQuestion.id);
        if(pos<questions.length-1){
            this.setState({currentQuestion:questions[pos+1]});
        }
        
    }

    back=()=>{
        const {currentQuestion, questions}=this.state;
        var pos = questions.map(function(e) { return e.id; }).indexOf(currentQuestion.id);
        if(pos>0){
            this.setState({currentQuestion:questions[pos-1]});
        }
        
    }

    finished=()=>{

    }

    selectAnswer=(item)=>{
        this.setState({awsActive:item})
    }

    renArr=()=>{
        var list=[]
        for (let i = 1; i < 31; i++) {
            var numberAnswer=this.randomInteger(2,6)+1;
            var qs={};
            var aws=[]
            qs.id=i;
            
            if(numberAnswer>4){
                qs.name=`Câu ${i}: Đây là game nào`;
                qs.imageUrl=img[this.randomInteger(0, img.length-1)]
            }else{
                qs.name=`Câu ${i}: Nội dung câu hỏi số ${i}`;
                qs.imageUrl="";
            }
            qs.duration=30;
            for (let j = 1; j < numberAnswer; j++) {
                aws.push(`Đáp án ${j}`)
            }
            qs.answers=aws;
            list.push(qs)
        }
        console.log(list)
    }

    randomInteger=(min, max)=> {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    render(){
        const {currentQuestion, awsActive, isBack, isNext}=this.state;
        return (
           <div style={{display:'flex', flexDirection:'row'}}>
                <div style={{display:'flex', alignContent:'center'}}>{currentQuestion.duration}</div>
                <div style={{display:'flex',flexDirection:'column'}}>
                    <div>
                        {currentQuestion.imageUrl && <img src={currentQuestion.imageUrl} width="50%"></img>}
                        <p>{currentQuestion.name}</p>
                    </div>
                    <div id="answer" style={{display:'flex',flexDirection:'row', marginBottom:20}}>
                        {currentQuestion.answers && currentQuestion.answers.map((item, index) => (
                            <div key={index}>
                                <span style={item===awsActive ? {backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}:{backgroundColor:'gray', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'} } onClick={()=>this.selectAnswer(item)}>{item}</span>
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