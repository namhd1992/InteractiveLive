'use strict'

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


    static loginGame=(code, grant_type)=>{
        var game_id=KeyStorage.getGameID()
        const data=JSON.stringify({
            "client_id": 'CF_PLAYZONE',
            "client_secret":  'a62c89asj3hao5jq9',
            "grant_type": grant_type,
            "scope": "profile games.catalog games.penalty games.bets wallet giftbox pay transaction content",
            "code": code,
            "code_verifier": "",
            "site_id": +game_id
        })
        var h= {...Service.headers};
        h.appId=game_id;

        var url = UltilsString.base_url()+'/api/v1/account/oauthtoken';

        var requestOptions = {
            method: 'POST',
            headers: h,
            body: data,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            var user_save = result.data;
            user_save.expired = Date.now();
            KeyStorage.setUser(JSON.stringify(user_save))
            // StorageManager.setValue("user_r", JSON.stringify(user_save));
            window.location.replace(`${KeyStorage.getOrigin()}${window.location.pathname}`);
        })
        .catch(error => {
            if(error.response.data.code ===-404){
                $('body').html('');
                $('body').html(`<div style="width: 100%;height: 50px;color: black;text-align: center;padding: 50px;">${error.response.data.message}</div>`);
            }
            KeyStorage.deleteUser();
            // StorageManager.deleteItem("user_r");
        });
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