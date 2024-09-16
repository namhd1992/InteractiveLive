
class UltilsDateTime{
    static timeRemain(times:any) {
        var day='00', hour='00', minute='00', second='00';
        var _this=this;
        setInterval(()=>{
            var time=(times-Date.now())/1000;
            if(time>0){
                day=Math.floor(time/86400) > 9 ? Math.floor(time/86400).toString() : `0${Math.floor(time/86400)}`;
                hour=Math.floor((time%86400)/3600) > 9 ? Math.floor((time%86400)/3600).toString() : `0${Math.floor((time%86400)/3600)}`;
                minute=Math.floor(((time%86400)%3600)/60) > 9 ? Math.floor(((time%86400)%3600)/60).toString() : `0${Math.floor(((time%86400)%3600)/60)}`;
                second=Math.ceil(((time%86400)%3600)%60) > 9 ? Math.ceil(((time%86400)%3600)%60).toString() : `0${Math.ceil(((time%86400)%3600)%60)}`;
            }
            return [day, hour, minute, second]
        }, 1000);
    }

    static timeConvert(times:any) {
		var a = new Date(times);
		var m = a.getMonth() + 1;
		var month = m > 9 ? m : `0${m}`;
		var date = a.getDate();
		var hour = a.getHours() > 9 ? a.getHours() : `0${a.getHours()}`;
		var min = a.getMinutes() > 9 ? a.getMinutes() : `0${a.getMinutes()}`;
		var s = `${hour}H${min}  -  ${date} - ${month}`;
		return s;
	}
}

export default UltilsDateTime;