<<<<<<< HEAD
var long = "";
var lat = "";
var longExt="";
var latExt = "";
var n = 0;
//get coordinates from browser by calling writeRequest function from getCurrentPosition
//putting writeRequest as a callback allows the position values to be remembered
var getLocation = function() {
  if (navigator.geolocation) {
    //anonymous function
    navigator.geolocation.getCurrentPosition(writeRequest);
  }
  else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
};

//put the coordinates (received in function described one below) into a request 
//that will be sent to USGS 
var writeRequest = function(position){
  long = position.coords.longitude.toString().slice(0,11);
  lat=position.coords.latitude.toString().slice(0,9);
  longExt=(position.coords.longitude+1).toString().slice(0,11);
  latExt=(position.coords.latitude+1).toString().slice(0,9);  
  var request = {
    format: "json",
    bBox: long+","+lat+","+longExt+","+latExt,
    period: "P5D",
    parameterCD: "00060",
    siteType:"ST",
    siteStatus: "active",
    csurl: 'http://waterservices.usgs.gov/nwis/iv/'
  };
  sendRequest(request);
};

//send the request to USGS via proxy
var sendRequest = function(request){
  //consider experimenting with saving $.ajax as a variable and basing sequence on 
  //the return of the ajax request
=======
//create namespace
var usgsData={};
//[[[[[[[[[[[[[[[[[[[[[[[MODEL]]]]]]]]]]]]]]]]]]]]]]]/////////////////
//create constructor function for the model. any attributes and methods go here
usgsData.model = function(){
  //create a flowSeries based on xData, yData, and gageName
  this.flowSeries = {};
  this.sites = [];
  this.numberOfSites = "";
  this.xData = [];
  this.yData = [];
  this.gageName = "";
};
//add pushFlowSeries method that adds each flowSeries to the array of sites
usgsData.model.prototype = {
  pushFlowSeries:function(){
    this.sites.push(this.flowSeries);
  },
//add getLocation method that calls writeRequest with the browser coordinates
  getLocation:function(){
  //if possible to get location from the browser
    if (navigator.geolocation) {
      //call writeRequest with the location results as the parameter
      this.writeRequest(navigator.geolocation.getCurrentPosition());
      navigator.geolocation.getCurrentPosition(this.writeRequest);
      //which of the two lines above work? and do I need to include 'this'?
    }
    else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  },
  //add writeRequest method that puts the getLocation results into a get request
  writeRequest:function(position){
    long=position.coords.longitude.toString().slice(0,11);
    lat=position.coords.latitude.toString().slice(0,9);
    longExt=(position.coords.longitude+1).toString().slice(0,11);
    latExt=(position.coords.latitude+1).toString().slice(0,9);  
    var request= {
      format: "json",
      bBox: long+","+lat+","+longExt+","+latExt,
      period: "P5D",
      parameterCD: "00060",
      siteType:"ST",
      siteStatus: "active",
      csurl: 'http://waterservices.usgs.gov/nwis/iv/'
    },
  this.sendRequest(request)
},
 sendRequest:function(request){
>>>>>>> 4f50fdca29a6f87bb2262092cca96afbbdad32d8
  $.ajax({
    url: 'https://www.gmtatennis.org/kp/proxy.php',
    format: "json",
    data: request,
    type: "GET"
  })
  .done(populateSeries)
  .fail(function(jqXHR, error){
    console.log("error sending request");
<<<<<<< HEAD
  });
};
//create an array to track each site's flowSeries
var sites = [];
//create a global variable that will count the number of sites
var numberOfSites = 0;
//populate flowSeries object with the results
var populateSeries = function(results){
  console.log(results);
  numberOfSites = results.value.timeSeries.length;
=======
  })
},
populateSeries:function(results){
  this.numberOfSites=results.value.timeSeries.length,
>>>>>>> 4f50fdca29a6f87bb2262092cca96afbbdad32d8
  //populate flowSeries object for each timeSeries
  for (i=0; i<this.numberOfSites; i++){
    //clear data arrays each round
    this.yData = [];
    this.xData = [];
    var gageName = "";
     //show the name of the result
    this.gageName=results.value.timeSeries[i].sourceInfo.siteName;
    //go through each x,y pair in that timeseries's results. 
    $.each(results.value.timeSeries[i].values[0].value, function(i, value){
      //use moment library to format iso timestamp, then push into xData array
      var timestamp = moment(value.dateTime).format("MM/DD HH:mm");
<<<<<<< HEAD
      xData.push(timestamp);
      yData.push(parseInt(value.value));
      });
    //flowSeries is the data object that is populated from USGS json
    makeFlowSeries(yData, xData, gageName);
   //makeFlowSeries pushes the site's results into the sites array
  };
  //once the results for each site have been populated, show the graph of the first site
  drawGraph();
=======
      this.xData.push(timestamp);
      this.yData.push(parseInt(value.value));
     });
    //end the loop by making a flowSeries from that's site's arrays
    this.makeFlowSeries(yData, xData, gageName);
  };
  
},
//makeFlowSeries pushes the site's results into the sites array
makeFlowSeries:function(yData, xData, gageName){
   this.flowSeries = function(yData,xData,gageName){
     labels: xData,
     datasets:[{
      label: gageName,
      pointStrokeColor: "#fff",
      strokeColor: "rgba(220,220,220,1)",
      data:yData,
      borderColor: '#0F5498',
      pointRadius: 0,
      fill: false
     }]
   };
   //call pushFlowSeries method to add new flowSeries to the array of sites
   this.pushFlowSeries();
 }
>>>>>>> 4f50fdca29a6f87bb2262092cca96afbbdad32d8
};
 

<<<<<<< HEAD
///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){
  //on load, get browser coordinates. all functions through end of populateSeries() are called
  getLocation();
  //start with first site
  n = 0;

  //when left arrow click, reduce the value of n by 1  
  $(".main").on("click","#leftArrow", function(){
    //click on arrow to reduce value of i by one
    if(n>0){
      n--;
      drawGraph();
    }
    else{
      n=numberOfSites-1;
      drawGraph();
    }
  });

  $(".main").on("click", "#rightArrow", function(){
    if (n+1<numberOfSites){
      n++;
      drawGraph();
    }
    else{
      n=0;
      drawGraph();
    }
  });
  //trigger right and left arrow clicks from key events
  $("body").keydown(function(e){
    if (e.which === 37){
      $("#leftArrow").trigger("click");
    }
  });

  $("body").keydown(function(e){
    if (e.which === 39){
      $("#rightArrow").trigger("click");
=======
///////////////////create the view object type///////////////
usgsData.view = function(){
  this.hydrograph = document.getElementById('graph').getContext('2d');
}
//create the drawGraph method that shows the number of sites and graphs the data
usgsData.view.prototype={
  drawGraph:function(sites, numberOfSites){
    $(".graph h5").html((n+1)+" of "+numberOfSites+" gages near you");
    var myChart = new Chart(hydrograph,{
      type: "line",
      data: sites[n],
      options: {
        scaleShowLabels: true,
        responsive: true,
        maintainAspectRatio: true,
        scales:{
            xAxes: [{
              type: "time",
              scaleLabel:{
                display: true,
                labelString: "Time (hours)"
              },
              time:{
                parser: true,
                unit: "hour",
                unitStepSize: 12,
                displayFormats: {
                  'hour': 'HH:mm', // 13:00
                  'day': 'DD MMM HH:mm', // 04 June 13:00
                }
              }
            }],
            yAxes:[{
              type: "logarithmic",
              scaleLabel:{
                display: true,
                labelString: "Flow (cfs)"
              }
            }]
         }
       }
>>>>>>> 4f50fdca29a6f87bb2262092cca96afbbdad32d8
    }
  }
};

//controller function to connect the two
usgsData.controller = function(model, view){
  //make usgsData.view.drawGraph the usgsData.model.sites array when populateSeries() is complete
  //view.drawGraph(model.sites, model.numberOfSites)
};
  
  
  ///////------------ON LOAD------------------////////////
$(document).ready(function(){
  var model = new usgsData.model();
  var view = new usgsData.view();
  var controller = new usgsData.controller(model,view);
});


