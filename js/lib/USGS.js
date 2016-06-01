var USGS = function() {
	this.url = "http://waterservices.usgs.gov/nwis/iv/";
};

USGS.prototype.get = function(objPosition) {
	return $.ajax({
		url: 'https://www.gmtatennis.org/kp/proxy.php',
		format: "json",
		data: this.buildRequestData(objPosition),
		type: "GET",
	});
};

USGS.prototype.buildRequestData = function(objPosition) {
	var long = objPosition.coords.longitude.toString().slice(0,11);
	var lat= objPosition.coords.latitude.toString().slice(0,9);
	var longExt= (objPosition.coords.longitude+1).toString().slice(0,11);
	var latExt= (objPosition.coords.latitude+1).toString().slice(0,9);
	var requestData = {
		bBox: long+","+lat+","+longExt+","+latExt,
		period: "P1D",
		parameterCD: "00060",
		siteType:"ST",
		siteStatus: "active",
		format: "json",
		csurl: this.url
	};
		
	return requestData;
};