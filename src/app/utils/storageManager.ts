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
}

export default StorageManager;