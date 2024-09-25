import React from "react";
import Service from "../../service/service";
import StorageManager from "../../ultils/storageManager";
import { useNavigate } from "react-router-dom";

class BXH extends React.Component{

    constructor(props) {
		super(props);
		this.state = {
            top10:[]
		};
	}

    componentDidMount(){
        Service.getBXH().then(v=>{
            if(v.code>0){
                console.log(v)
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
        const {top10}=this.state;
        return (
           <div>
                {top10.map((obj, index)=>{
                    <span></span>
                })}
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