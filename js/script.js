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
    };
  this.sendRequest(request);
},
 sendRequest:function(request){
  $.ajax({
    url: 'https://www.gmtatennis.org/kp/proxy.php',
    format: "json",
    data: request,
    type: "GET"
  })
  .done(populateSeries)
  .fail(function(jqXHR, error){
    console.log("error sending request");
  })
},
populateSeries:function(results){
  this.numberOfSites=results.value.timeSeries.length;
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
      this.xData.push(timestamp);
      this.yData.push(parseInt(value.value));
     });
    //end the loop by making a flowSeries from that's site's arrays
    this.makeFlowSeries(yData, xData, gageName);
  };
  
},
//makeFlowSeries pushes the site's results into the sites array
makeFlowSeries:function(yData, xData, gageName){
   this.flowSeries = {
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
};
 

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
    });
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


