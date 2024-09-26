import React from "react";
import Service from "../../service/service";
import StorageManager from "../../ultils/storageManager";
import { useNavigate } from "react-router-dom";

class BXH extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            top10:[],
            isLoading:true
		};
	}

    componentDidMount(){
        Service.getBXH().then(v=>{
            if(v.code>0){
                this.setState({isLoading:false, top10:v.data.quizResults});
            }
        })

    }

    componentDidUpdate(){

    }

    componentWillUnmount(){

    }

    viewHistory=()=>{
        var gameid=StorageManager.getGameID()
        this.props.navigate(`/statistic?gameid=${gameid}`);
    }

    render(){
        const {top10, isLoading}=this.state;

        if(isLoading){
            return <div></div>
        }
        return (
           <div>
                {top10.length>0 && top10.map((item, index) => (
                        <div key={index} style={{marginBottom:20}}>
                            <span style={{fontSize:20, fontWeight:'bold'}}>{item.ranking}:{item.username}</span>
                        </div>
                ))}
                <div>
                    <span style={{backgroundColor:'green', color:'#fff', fontSize:20, fontWeight:'bold', padding:'7px 15px', marginRight:10, cursor:'pointer'}} onClick={this.viewHistory}>Xem Lịch Sử</span>
                </div>
           </div>
        )
    }

}


export default function (props) {
    const navigate = useNavigate();
  
    return <BXH {...props} navigate={navigate} />;
}