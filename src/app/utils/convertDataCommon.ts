'use strict'

class ConvertDataServer{
    static getValueCommon(data:any, constants:string){
        var obj=data.filter(v =>v.code===constants);
		return obj[0].value;
	};

    static getValueCommonJson(data:any, constants:string){
        var obj=data.filter(v =>v.code===constants);
		return JSON.parse(obj[0].value);
	};
}

export default ConvertDataServer;