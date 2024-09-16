
class UltilsString{
    static parse_query_string = (name, url) => {
		name = name.replace(/[[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};

	static parse_query_string_playzone=(name, url)=>{
        name = name.replace(/[[\]]/g, "\\$&");
        var regex = new RegExp("[#&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };

    static base_url = () => {
			return "http://103.82.31.215:8028/Interactive_Quiz";
	}

	static base_url_gf = () => {
			return "https://api-gf.splay.vn"
	}

	static base_url_client = () => {
	}


}

export default UltilsString


// http://103.82.31.215:8028/Interactive_Quiz/api/v1/settings/{serviceId}/{lang}-settings.json