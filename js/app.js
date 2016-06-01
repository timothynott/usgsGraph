// create an object for this application's namespace
var app = {};

// controller
app.controller = function(view, model) {
	this.view = view;
	this.view.status("geoseek"); // update status text on page
	this.model = model;
	this.model.gotDataCallback = this.view.init.bind(this.view);
	this.view.model = this.model;
	
};

/*app.controller.prototype.viewInit = function (totalSites, sites) {
	this.view.init(totalSites, sites);
};*/

app.controller.prototype.run = function() { // we'll call this once we have a position
	var that = this; //maintain scope for use in callback
	console.log("controller.run", objPosition);
	// use the position to populate the model with data from the USGS API
	// When this is done, use the data to populate the view
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(data){
			that.model.getData(data, that.view.init);
		});
	}
	else {
		that.view.status("nogeo");
	}
};

// model
app.model = function() {
	this.totalSites = 0;
	this.sites = [];
	this.gotDataCallback;
};

app.model.prototype.getData = function (objPosition, callback) {
	var usgsRequest = new USGS();
	this.getDataCallback = callback;
	var that = this;
	usgsRequest.get(objPosition)
		//if json request works, call populateResult() function to save result object
		//and make it accessible globally
		.done(function(result){
			that.setData(result.value.timeSeries.length, result.value.timeSeries);
		})
		.fail(function(jqXHR, error){
			console.log("error sending request");
		});
};

app.model.prototype.setData = function(total, sites) {
	this.totalSites = total;
	this.sites = sites;
	this.gotDataCallback();
};

// view
app.view = function(previous, next, curr, total, status) {
	this.rightArrow = document.getElementById(next);
	this.leftArrow = document.getElementById(previous);
	this.textPosition = document.getElementById(curr);
	this.textTotal = document.getElementById(total);
	this.status = document.getElementById(status);
	this.currSite = 0;
	this.model;
};

app.view.prototype.statusUpdate = function(which) {
	var statusText = '';
	switch(which) {
		case "geoseek":
			statusText = "Attempting to get GPS coordinates";
		break;
		case "nogeo":
			statusText = "Geolocation is not supported by this browser.";
		break;
		case "sitenav":
			statusText = (this.currSite+1)+" of "+this.model.totalSites+" gages near you";
		break;
	}
	this.status.innerHTML(statusText);
};

app.view.prototype.init = function () {
	var that = this;
	console.log("view.init");
	// set up arrows and keyboard manipulation
	this.rightArrow.addEventListener('click', function() {
		that.next();
	});
	this.leftArrow.addEventListener('click', function() {
		that.previous();
	});
	$("body").keydown(function(e){
		if (e.which === 37){
			that.next();
		}
		else if (e.which === 39){
			that.previous();
		}
	});
	// show first site
	this.display(0);
};


app.view.prototype.previous = function() {
	this.display(this.currSite - 1);
};

app.view.prototype.next = function() {
	this.display(this.currSite + 1);
};

app.view.prototype.display = function (gageIndex) {
	if(gageIndex > -1 && gageIndex < this.model.totalSites) {
		console.log("show site", gageIndex);
		this.currSite = gageIndex;
	}
	else {
		console.log("trying to show an illegal site index: " + gageIndex);
		this.display((gageIndex >= 0) ? 0 : this.model.totalSites - 1); // if out of range, go to front or rear
	}
};