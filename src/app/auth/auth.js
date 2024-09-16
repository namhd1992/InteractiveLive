import UltilsString from '../ultils/string_ultils.js'
import Loading from '../ui/loading.js';
import Service from '../service/service.js';
import StorageManager from '../storage/storageManager.js';
import KeyStorage from '../ultils/setKeyStorage.js';

class Auth {

    static login=()=>{
        // StorageManager.deleteItem("user_r");
		// window.location.replace(`http://graph.vtcmobile.vn/oauth/authorize?client_id=92d34808c813f4cd89578c92896651ca&redirect_uri=${KeyStorage.getOrigin()}${window.location.pathname}?type=scoin_code&action=login&agencyid=0`)
        window.location.replace(`http://graph.vtcmobile.vn/oauth/authorize?client_id=92d34808c813f4cd89578c92896651ca&redirect_uri=${KeyStorage.getOrigin()}${window.location.pathname}${KeyStorage.url_return()}&action=login&agencyid=0`)
    }

	static logout=()=>{
		// StorageManager.deleteItem("user_r");
        KeyStorage.deleteUser();
		window.location.replace(
			`https://graph.vtcmobile.vn/oauth/authorize?client_id=92d34808c813f4cd89578c92896651ca&redirect_uri=${KeyStorage.getOrigin()}${window.location.pathname}${KeyStorage.url_return()}&action=logout&agencyid=0`,
		)
	}

    static checkTimeout=()=>{
        var user = this.getUser();
        if (KeyStorage.getUser() != null) {
            var now = Date.now(); //todays date
            var end = user.expired; // another date
            var duration = end-now;
            var millisecond = duration + user.expires_in*1000;
            if (millisecond < 0) {
                KeyStorage.deleteUser();
                // StorageManager.removeItem("user_r");
            }
        }
    }

	static getUser=()=>{
        var user = JSON.parse(KeyStorage.getUser());
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