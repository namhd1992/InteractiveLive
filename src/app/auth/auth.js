import UltilsString from '../ultils/string_ultils.js'
import Service from '../service/service.js';
import StorageManager from '../ultils/storageManager.js';

class Auth {

    static login=()=>{
       window.location.replace(`http://graph.vtcmobile.vn/oauth/authorize?client_id=92d34808c813f4cd89578c92896651ca&redirect_uri=${StorageManager.getOrigin()}${window.location.pathname}&action=login&agencyid=0`)
    }

	static logout=()=>{
        StorageManager.deleteUser();
		window.location.replace(
			`https://graph.vtcmobile.vn/oauth/authorize?client_id=92d34808c813f4cd89578c92896651ca&redirect_uri=${StorageManager.getOrigin()}${window.location.pathname}&action=logout&agencyid=0`,
		)
	}

    static checkTimeout=()=>{
        var user = this.getUser();
        if (StorageManager.getUser() != null) {
            var now = Date.now(); //todays date
            var end = user.expired; // another date
            var duration = end-now;
            var millisecond = duration + user.expires_in*1000;
            if (millisecond < 0) {
                StorageManager.deleteUser();
            }
        }
    }

	static getUser=()=>{
        var user = JSON.parse(StorageManager.getUser());
        return user;
    }

	static isLogin=()=>{
        if(this.getUser()!==null){
            return true;
        }
        return false;
    }

    static getUserId=()=>{
        var user=this.getUser()
        return user.uid;
    }

    static getUserName=()=>{
        var user=this.getUser()
        return user.full_name;
    }

    static getToken=()=>{
        var user=this.getUser()
        return user.access_token;
    }
}

export default Auth;