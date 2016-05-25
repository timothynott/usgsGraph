
//[[[[[[[[[[[[[[[[[[[[[[[MODEL]]]]]]]]]]]]]]]]]]]]]]]/////////////////
var model = function(){};
//create constructor function for the model. any attributes and methods go here
model.prototype.constructor = model;
  
//add getLocation object that calls writeRequest with the browser coordinates
var getLocation=function(){
  //if possible to get location from the browser
    if (navigator.geolocation) {
      //return the geolocation object
      return navigator.geolocation.getCurrentPosition(writeRequest);
    }
    else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
};
  //add usgsRequest object that is an instance of model that writes and sends request to USGS
var usgsRequest = new model();
//add the request object as a property of usgsRequest object
usgsRequest.request = {
      format: "json",
      bBox: "",
      period: "P5D",
      parameterCD: "00060",
      siteType:"ST",
      siteStatus: "active",
      csurl: 'http://waterservices.usgs.gov/nwis/iv/'
};
//add writeRequest and sendRequest as methods of the usgsRequest object
usgsRequest.prototype={
  //writeRequest turns the getCurrentPosition object into a string in the request
  writeRequest:function(position){
    console.log(position);
    long=position.coords.longitude.toString().slice(0,11);
    lat=position.coords.latitude.toString().slice(0,9);
    longExt=(position.coords.longitude+1).toString().slice(0,11);
    latExt=(position.coords.latitude+1).toString().slice(0,9);  
    this.request.bBox = long+","+lat+","+longExt+","+latExt;
    return this.request
  },
  //sendRequest sends the request written by writeRequest
  sendRequest:function(){
    console.log(request);
    $.ajax({
      url: 'https://www.gmtatennis.org/kp/proxy.php',
      format: "json",
      data: this.writeRequest(getLocation),
      type: "GET"
    })
    //if it works, callback populateSeries.pushData
    .done(populateSeries.pushData)
    .fail(function(jqXHR, error){
      console.log("error sending request");
    })
  }
};

var populateSeries = Object.create(model.prototype);
//add populateSeries model that has properties numberofSites, yData, xData, and gageName.
//the readResult method pushes the usgsData into yData and xData arrays
populateSeries.readResult = function(results){
  this.numberOfSites=results.value.timeSeries.length;
  //populate flowSeries object for each timeSeries
  for (i=0; i<this.numberOfSites; i++){
    //clear data arrays each round
    this.yData = [];
    this.xData = [];
    this.gageName = "";
     //show the name of the result
    this.gageName=results.value.timeSeries[i].sourceInfo.siteName;
    //go through each x,y pair in that timeseries's results. 
    $.each(results.value.timeSeries[i].values[0].value, function(i, value){
      //use moment library to format iso timestamp, then push into xData array
      var timestamp = moment(value.dateTime).format("MM/DD HH:mm");
      this.xData.push(timestamp);
      this.yData.push(parseInt(value.value));
     });
  }

};
//make sites object
var sites = new model();
sites.array = [];
//give sites object an addFlowSeries method that adds each flowSeries to the sites array
sites.addFlowSeries = function(flowSeries){
  this.sites.array.push(flowSeries);
};
 

///////////////////create the view object type///////////////
view = function(){
  this.hydrograph = document.getElementById('graph').getContext('2d');
};
view.prototype.constructor = view;

//create the drawGraph method that shows the number of sites and graphs the data
view.drawGraph=function(){
    $(".graph h5").html(numberOfSites+" gages near you");
    var myChart = new Chart(this.hydrograph,{
      type: "line",
      data: model.sites.array,
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
         }//close scales
       }//close options
    });//close myChart
};//close drawGraph
view.makeFlowSeries=function(){
   this.flowSeries = {
     labels: populateSeries.xData,
      datasets:[{
        label: populateSeries.gageName,
        pointStrokeColor: "#fff",
        strokeColor: "rgba(220,220,220,1)",
        data: populateSeries.yData,
        borderColor: '#0F5498',
        pointRadius: 0,
        fill: false
      }]
    }
 };


  
  ///////------------ON LOAD------------------////////////
$(document).ready(function(){
  //controller function to connect the two
  controller = function(){
    //call populateSeries.readResult when usgsData is done
    usgsData(populateSeries.readResult);
    //call view.drawGraph when model.populateSeries is done
    populateSeries(drawGraph);
  };
});


