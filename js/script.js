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
    bBox: long+","+lat+","+longExt+","+latExt,
    period: "P1D",
    parameterCD: "00060",
    siteType:"ST",
    siteStatus: "active",
    format: "json",
  };
  sendRequest(request);
};

//send the request to USGS
var sendRequest = function(request){
  //console.log(request);
  //request carries over
  $.ajax({
    url: "http://waterservices.usgs.gov/nwis/iv/?",
    format: "json",
    data: request,
    type: "GET",
  })
  //if json request works, call populateResult() function to save result object
  //and make it accessible globally
  .done(populateSeries)
  .fail(function(jqXHR, error){
    console.log("error sending request");
  })
};

//define data arrays
 var yData = [];
 var xData = [];
 var gageName = "";
 //sites array will hold each iteration of flowSeries;
 var sites = [];
//include options for flowSeries
var options = {scaleShowGridLines : true, scaleShowVerticalLines: true};


//populate one flowSeries object per site
var populateSeries = function(results){
  console.log(results.value);
  //but when I look at usgsResults here, it's empty
  console.log(results.value.timeSeries.length);
  //show how many results
  var numberOfSites = results.value.timeSeries.length;
  $(".graph h5").html(numberOfSites+" gages near you");
  
  //create a flowSeries object for each timeSeries in the results
  for (i=0; i<numberOfSites; i++){
    //show the name of the result
    gageName=results.value.timeSeries[i].sourceInfo.siteName;
    //go through each x,y pair in that timeseries's results. 
    $.each(results.value.timeSeries[i].values[0].value, function(i, value){
    xData.push(value.dateTime);
    yData.push(parseInt(value.value));
    });
    //flowSeries is the data object that is populated from USGS json
    var flowSeries = {
      labels:xData,
      datasets:[{
          label: gageName,
          pointStrokeColor: "#fff",
          strokeColor: "rgba(220,220,220,1)",
          data:yData
          //xAxisID: "Time",
          //yAxisID: "Flow (cfs)",
          //fill:false,
          //lineTension: 0,
          //borderColor: "white",
          //pointRadius: 0, 
      }],
      options: options
    };
  sites.push(flowSeries);
  }
  var hydrograph = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(hydrograph,{
    type: "line",
    data: sites[n]
  });
};

///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

  getLocation();
  n = 0;
  
  
  //populateSeries();
  //writeRequest() calls sendRequest();
  //sendRequest already calls populateSeries();
  
  $(".main").on("click","#leftArrow", function(){
    //click on arrow to reduce value of i by one
    n --;
    var hydrograph = document.getElementById('graph').getContext('2d');
    var myChart = new Chart(hydrograph,{
      type: "line",
      data: sites[n]
    });
  });

  $(".main").on("click", "#rightArrow", function(){
    n ++;
    var hydrograph = document.getElementById('graph').getContext('2d');
    var myChart = new Chart(hydrograph,{
      type: "line",
      data: sites[n]
    });
  });
});

////////////////////////////////////////////////////////////////////

