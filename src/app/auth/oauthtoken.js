import UltilsString from '../ultils/string_ultils.js';
import Loading from '../ui/loading.js';
import Service from '../service/service.js';
import StorageManager from '../ultils/storageManager.js';
import KeyStorage from '../ultils/setKeyStorage.js';

class AuthToken {

    static authToken=(code, grant_type)=>{
        var game_id=StorageManager.getGameID();
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

        var url = UltilsString.base_url()+'/api/v1/account/login';

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
            StorageManager.setUser(JSON.stringify(user_save))
            window.location.replace(`${KeyStorage.getOrigin()}${window.location.pathname}${KeyStorage.url_return()}`);
        })
        .catch(error => {
            if(error.response.data.code ===-404){
                $('body').html('');
                $('body').html(`<div style="width: 100%;height: 50px;color: black;text-align: center;padding: 50px;">${error.response.data.message}</div>`);
            }
            StorageManager.deleteUser();
        });
    }
}

export default AuthToken;