''
import Auth from "../auth/auth.js";
import Ultilities from "../ultils/string_ultils.js";
// import axios from "../lib/lib/axios.min.js";
import Loading from "../ui/loading.js"
import StorageManager from "../storage/storageManager.js";

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

    static getInfoGameWithoutLogin=(code)=>{
        var data={...info};
        data.code=code;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
        return new Promise((resolve, reject)=>{
          fetch(Ultilities.base_url_gf()+'/catalog/api/v1/setting/get-game-settings?'+new URLSearchParams(data), requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result)
                resolve(result)
            })
            .catch(error => {
                resolve(error.response);
            });
        })

        // return 10;
    }

    static getInfoGameWithLogin=()=>{
        var data={};
        data.claims= "UsersBalance";
        var url=Ultilities.base_url()+`/api/v1/settings/${Loading.getGameID()}/${headers.lang}-settings.json?`+ new URLSearchParams(data);
        

        var h= {...headers};
        h.appId=Loading.getGameID();
        if(Auth.isLogin()){
            return this.fetchGetDataWithTokenParams(h, url)
        }else{
            return this.getAppsettingWithoutToken(h, url)
        }
    }


    
    static quickLogin=(fullName, email, sdt)=>{
        var url=Ultilities.base_url()+'/users/api/v1/account/quick-login';
        var data= {...info};
        data.gameId=Loading.getGameID();
        data.site_id=Loading.getGameID();
        data.client_id= "GF_EVENTS_WEB";
        data.client_secret= "aP6k2Ql68arPH8l";
        data.scope= "profile games.catalog games.penalty games.bets wallet giftbox pay transaction content",
        data.grant_type= "user-data",
        data.email= email,
        data.PhoneNumber=sdt,
        data.FullName=fullName,
        data.UserName= ""

        return this.fetchData(data, url)
    }

    static getInfoUsser=()=>{
        var url=Ultilities.base_url()+'/users/api/v1/account/get-info';
        var data= {...info};
        return this.fetchDataWithToken(data, url)
    }

    static getItem=()=>{
        var url=Ultilities.base_url()+'/api/v1/rooms/inplay';

        var data= {};
        // data.gameId=+Loading.getGameID();
        data.modeId=-1;

        var h= {...headers};
        h.appId=+Loading.getGameID();
        
        // data.userId=Auth.getUserId();
        return this.fetchData_v2(data, h, url)
    }

    static getListItems=()=>{

        var url=Ultilities.base_url()+'/api/v1/rooms/list-inplay';

        var data= {};
        data.gameId=+Loading.getGameID();
        data.modeId=-1;

        var h= {...headers};
        h.appId=+Loading.getGameID();
        
        // data.userId=Auth.getUserId();
        return this.fetchData_v2(data, h, url)
    }


    static rollup=()=>{
        var url=Ultilities.base_url()+'/spinwheel/api/v1/rewards/receive-event-free';
        var data= {...info};
        data.modeId=-1;
        data.userId=Auth.getUserId();
        data.roomId= -1;
        data.character="";
        data.server="";

        return this.fetchDataWithToken(data, url)
      
    }

    static play=(x)=>{

        var url=Ultilities.base_url()+`/api/v1/games/${+Loading.getGameID()}/playing`;
     
        var data= {};
        data.modeId=-1;
        data.roomId=-1;
        data.server="";
        data.character="";
        data.numPlayed=x;

        var h= {...headers};
        h.appId=+Loading.getGameID();

        return this.fetchDataWithToken_v2(data, h, url)

    }
    static getHistory=(pageIndex:number)=>{
        var url=Ultilities.base_url()+'/api/v1/games/logs';

        var data= {};
        data.modeId=-1;
        data.userId=Auth.getUserId();
        data.type= 0;
        data.rewardType= 0;
        data.fromDate=0;
        data.toDate= 0;
        data.pageIndex= pageIndex;
        data.pageSize=10;

        var h= {...headers};
        h.appId=+Loading.getGameID();

        return this.fetchDataWithToken_v2(data, h, url)
        
    }

    static getBXH=(path_url)=>{
        var url=Ultilities.base_url()+path_url;

            
        var data= {...info};
        data.modeId=-1;
        data.gameId=Loading.getGameID();
        // data.userId=Auth.getUserId();
        data.startId=0;
        data.limit=10;

        return this.fetchData(data, url)
    }

    static sendCode=(code)=>{
        var url=Ultilities.base_url()+'/users/api/v1/account/redeem-invite-code';

            
        var data= {...info};
        data.modeId=-1;
        data.gameId=Loading.getGameID();
        data.site_id=Loading.getGameID();
        data.client_id= "GF_EVENTS_WEB";
        data.client_secret= "aP6k2Ql68arPH8l"
        // data.userId=Auth.getUserId();
        data.code=code;

        return this.fetchData(data, url)
    }


    static updateInfoUser=(username, email, sdt)=>{ 
        var url=Ultilities.base_url()+'/users/api/v1/account/update-info';

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json, text/plain, */*");
        myHeaders.append("Authorization", `Bearer ${Auth.getToken()}`);
        myHeaders.append("Content-Type", "application/json");

        var data= {...info};
        data.fullName=username;
        data.phoneNumber=sdt;
        data.email=email;
        

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }




    static getTuDo=(pageIndex)=>{
        var url=Ultilities.base_url()+'/api/v1/giftbox/history';

        var data= {};
        data.modeId=-1;
        data.gameId=+Loading.getGameID();
        data.userId=Auth.getUserId();
        data.serverId=0;
        data.type=0;
        data.fromDate=0;
        data.toDate=0;
        data.pageIndex= pageIndex;
        data.pageSize=10;

        var h= {...headers};
        h.appId=+Loading.getGameID();

        return this.fetchDataWithToken_v2(data, h, url)

    }

    static getItemAward=(item)=>{
        console.log(item)
        var url=Ultilities.base_url()+'/api/v1/giftbox/open';
        
        var data= {};
        data.userId=Auth.getUserId();
        data.id=item.id;

        var h= {...headers};
        h.appId=+Loading.getGameID();

        return this.fetchDataWithToken_v2(data, h, url)
    }

    static viewItemAward=(item)=>{
        var url=Ultilities.base_url()+'/api/v1/giftbox/view';

        var data= {};
        data.userId=Auth.getUserId();
        data.id=item.id;

        var h= {...headers};
        h.appId=+Loading.getGameID();

        return this.fetchDataWithToken_v2(data, h, url)
    }

    static getUserLocation=(type, parentId)=>{
        var url=Ultilities.base_url()+'/catalog/api/v1/setting/get-location';

        var data= {...info};
        data.userId=Auth.getUserId();
        data.gameId=Loading.getGameID();
        data.parentId = parentId;
		data.type = type;
        return this.fetchDataWithToken(data, url)
    }

    static updateFormDK=(listParams)=>{
        var url=Ultilities.base_url()+'/luckyrandom/api/v1/account/save-user-data';
        var data= {...info, ...listParams};
        return this.fetchDataWithToken(data, url)
    }




    static getUpdateAcc=()=>{
        var url=Ultilities.base_url()+'/api/v1/account/getbalances';

        var data={};
        data.accountType= 0;
        var h= {...headers};
        h.appId=Loading.getGameID();
        return this.fetchDataWithToken_v2(data, h, url)
    }


    
    static fetchData=(data, url)=>{
        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json, text/plain, */*");
        // myHeaders.append("Authorization", `Bearer ${Auth.getToken()}`);
        myHeaders.append("Content-Type", "application/json");

        

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data),
            redirect: 'follow'
        };
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error.response);
            });
        })
    }

    static fetchDataWithToken=(data, url)=>{ 
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error);
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }

    static fetchGetDataWithToken=(data, h, url)=>{ 
        var header= {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "Authorization": `Bearer ${Auth.getToken()}`,
            ...h
        }

        
        var requestOptions = {
            method: 'GET',
            headers: header,
            // body: JSON.stringify(data),
            redirect: 'follow'
        };
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }

    static fetchDataWithToken_v2=(data,h, url)=>{ 
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
        Loading.showLoading();
        return new Promise((resolve, reject)=>{
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                Loading.hideLoading();
                resolve(result)
            })
            .catch(error => {
                resolve(error);
            });
        })
    }
}

export default Service;
