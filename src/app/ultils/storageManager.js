import UltilsString from "./string_ultils.js";
class StorageManager{
    static setValue = (name:string, data:string) => {
		localStorage.setItem(name, data);
	}

    static getValue = (name:string) => {
		let data = localStorage.getItem(name);
        return data;
	}

    static deleteItem = (name:string) => {
		localStorage.removeItem(name);
	}

    static deleteAll = () => {
		localStorage.clear();
	}

	static setGameID = (game_id) => {
		var key=this.getCodeByUrl();
		StorageManager.setValue(`game_${key}`, game_id)
	}

    static getGameID = () => {
		var key=this.getCodeByUrl();
		return StorageManager.getValue(`game_${key}`)
	}


    static setAppsetting = (appsetting) => {
        var key=this.getCodeByUrl();
		StorageManager.setValue(`appsetting_${key}`, appsetting)
	}

    static getAppsetting = () => {
        var key=this.getCodeByUrl();
		return StorageManager.getValue(`appsetting_${key}`)
	}

	static setUser = (user) => {
        var key=this.getCodeByUrl();
		StorageManager.setValue(`user_${key}`, user)
	}

    static getUser = () => {
		var key=this.getCodeByUrl();
		return StorageManager.getValue(`user_${key}`)
	}

	static deleteUser = () => {
		var key=this.getCodeByUrl()
		StorageManager.deleteItem(`user_${code}`)
		
	}

	static getCodeByUrl = () => {
		var gameid=UltilsString.parse_query_string('gameid', window.location.href);
		return gameid;

	}
}

export default StorageManager;