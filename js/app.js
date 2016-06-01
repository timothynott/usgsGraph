// create an object for this application's namespace
var app = {};

// controller
app.controller = function(view, model) {
	this.view = view;
	this.view.statusUpdate("geoseek"); // update status text on page
	this.model = model;
	this.model.gotDataCallback = this.view.init.bind(this.view);
	this.view.model = this.model;
	
};

/*app.controller.prototype.viewInit = function (totalSites, sites) {
	this.view.init(totalSites, sites);
};*/

app.controller.prototype.run = function() { // we'll call this once we have a position
	var that = this; //maintain scope for use in callback
	console.log("controller.run");
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
app.view = function(previous, next, status, graph) {
	this.rightArrow = document.getElementById(next);
	this.leftArrow = document.getElementById(previous);
	this.status = document.getElementById(status);
	this.graph = document.getElementById(graph).getContext('2d');
	this.currSite = 0;
	this.model;
	this.chart;
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
	this.status.innerHTML = statusText;
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
		this.statusUpdate('sitenav');
		this.chartUpdate();
	}
	else {
		console.log("trying to show an illegal site index: " + gageIndex);
		this.display((gageIndex >= 0) ? 0 : this.model.totalSites - 1); // if out of range, go to front or rear
	}
};

app.view.prototype.chartUpdate = function() {
	var xData = [];
	var yData = [];
	this.model.sites[this.currSite].values[0].value.forEach(function(val, i) {
		xData.push(moment(val.dateTime).format("MM/DD HH:mm"));
		yData.push(parseInt(val.value));
	}, this);
	var flowSeries = {
		labels:xData,
		datasets:[{
			label: this.model.sites[this.currSite].sourceInfo.siteName,
			pointStrokeColor: "#fff",
			strokeColor: "rgba(220,220,220,1)",
			data:yData,
			borderColor: '#0F5498',
			pointRadius: 0,
			fill: false
		}]
    };  
	if(typeof this.chart !== 'undefined') { // need to destroy previous chart object
		this.chart.destroy();
	}
	this.chart = new Chart(this.graph,{
	    type: "line",
	    data: flowSeries,
	    options: {
	        scaleShowLabels: true,
	        responsive: true,
	        maintainAspectRatio: true,
	        scales:{
	          xAxes: [{
	            type: "time",
	            scaleLabel:{
	              display: true,
	              labelString: "Time"
	            },
	            time:{
	              parser: true,
	              unit: "day",
	              unitStepSize: 1,
	              displayFormats: {
	                'hour': 'HH:mm', // 13:00
	                'day': 'DD MMM', // 04 June
	              }
	            }
	          }],
	          yAxes:[{
	            type: "linear",
	            scaleLabel:{
	              display: true,
	              labelString: "Flow (cfs)"
	            }
	          }]
        	}
    	}
  	});
};