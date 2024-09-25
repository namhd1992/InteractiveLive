import Auth from "../auth/auth.js";
import Ultilities from "../ultils/string_ultils.js";
import StorageManager from '../ultils/storageManager.js'

const info={
	lang: "vi",
	osType: 'WINDOWS',
	osName:'WINDOWS',
    // site_id: 100009,
	deviceId: "00000000-0000-0000-0000-000000000000",
	deviceName: "none",
	osVersion: "10",
	appVersion: "2.0.0",
	requestId: 1929292992929,
}

const headers= { 
    'lang': 'vi', 
    'osType': 'IOS', 
    'deviceId': '00811E96-8F17-463E-8E73-4804E9DE5B55', 
    'deviceName': 'iPhone XS', 
    'appVersion': '1.0.0', 
    'osVersion': '14.6', 
    'requestId': '1669261838047', 
    'deviceType': '21', 
    'buildNumber': '1', 
    'agentId': '0',
    'Content-Type': 'application/json'
}

class Service{
    static headers=headers;
 

    static getGameIdByCode=(code)=>{

        var data={...info};
        data.code=code;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(Ultilities.base_url_gf()+"/catalog/api/v1/setting/get-game-info?"+new URLSearchParams(data), requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error.response);
            });
        })
    }

    static getInfoGameWithLogin=()=>{
        var data={};
        var gameid=StorageManager.getGameID()
        data.claims= "UsersBalance";
        var url=Ultilities.base_url()+`/api/v1/settings/${gameid}/${headers.lang}-settings.json?`+ new URLSearchParams(data);
        

        var h= {...headers};
        h.appId=gameid;
        if(Auth.isLogin()){
            return this.fetchGetDataWithTokenParams(h, url)
        }else{
            return this.getAppsettingWithoutToken(h, url)
        }
    }
    // http://103.82.31.215:8028/Interactive_Quiz/api/v1/quizs/{quizId}/top
    // http://103.82.31.215:8028/Interactive_Quiz/api/v1/quizs/{quizId}/history/{userId}
    static getBXH=()=>{
        var gameid=StorageManager.getGameID()
        var h= {...headers};
        h.appId=gameid;

        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/top`;
       

        return this.fetchGetDataWithTokenParams(h, url)
    }

    static getInfoQuiz=()=>{
        var gameid=StorageManager.getGameID()
        var h= {...headers};
        h.appId=gameid;

        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}`;
       
        return this.fetchGetDataWithTokenParams(h, url)
    }


    static startQuiz=(data)=>{
        var gameid=StorageManager.getGameID()
        var h= {...headers};
        h.appId=gameid;

        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/started`;
       
        return this.fetchData_v2(data, h, url)
    }

    static answersQuestion=(data)=>{
        var gameid=StorageManager.getGameID()
        var h= {...headers};
        h.appId=gameid;

        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/answers`;
       
        return this.fetchData_v2(data, h, url)
    }

    static finishedQuiz=(data)=>{
        var gameid=StorageManager.getGameID()
        var h= {...headers};
        h.appId=gameid;
        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/finished`;
       
        return this.fetchData_v2(data, h, url)
    }


    static getStatusQuiz=(data)=>{
        var gameid=StorageManager.getGameID()
        var userId=Auth.getUserId();
        var h= {...headers};
        h.appId=gameid;
        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/state/${userId}`;
       
        return this.fetchData_v2(data, h, url)
    }

    static getHistoryQuiz=()=>{
        var gameid=StorageManager.getGameID();
        var userId=Auth.getUserId();
        var h= {...headers};
        h.appId=gameid;

        var url=Ultilities.base_url()+`/api/v1/quizs/${gameid}/history/${userId}`;
       
        return this.fetchGetDataWithTokenParams(h, url)
    }



    
    static fetchData=(data, url)=>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json, text/plain, */*");
        myHeaders.append("Content-Type", "application/json");

        

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error.response);
            });
        })
    }

    static fetchData_v2=(data, h, url)=>{

        var header= {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${Auth.getToken()}`,
            ...h
        }
        

        var requestOptions = {
            method: 'POST',
            headers: header,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error.response);
            });
        })
    }


    static fetchDataAppSetting=(data, url)=>{ 
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json, text/plain, */*");
        myHeaders.append("Authorization", `Bearer ${Auth.getToken()}`);
        myHeaders.append("Content-Type", "application/json");

        

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }


    static fetchGetDataWithTokenParams=(h, url)=>{ 
        var header= {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${Auth.getToken()}`,
            ...h
        }
        
        var requestOptions = {
            method: 'GET',
            headers: header,
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }

    static getAppsettingWithoutToken=(h, url)=>{ 
        var header= {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            ...h
        }
        
        var requestOptions = {
            method: 'GET',
            headers: header,
            redirect: 'follow'
        };
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }
}

export default Service;
