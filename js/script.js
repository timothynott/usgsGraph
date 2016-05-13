var long = "";
var lat = "";
var longExt="";
var latExt = "";
var n = 0;


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
  }
  console.log(request);
  sendRequest(request);
};
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


        

//define data arrays
 var yData = [];
 var xData = [];
 var gageName = [];
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
//include options for flowSeries
var options = {scaleShowGridLines : true, scaleShowVerticalLines: true};




//if the request (one funtion down) is successfully sent, populate flowSeries with the results
var populateSeries = function(result){
  //show how many results
  $(".graph h5").html("1 of "+result.value.timeSeries.length+" gages near you");
  //show the name of the result
  gageName=result.value.timeSeries[n].sourceInfo.siteName;
  console.log(gageName);
  //go through each x,y pair in the result. value of n starts at 0 and changes as arrows are clicked
  $.each(result.value.timeSeries[n].values[0].value, function(i, value){
    xData.push(value.dateTime);
    yData.push(parseInt(value.value));
  })
  var hydrograph = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(hydrograph,{
    type: "line",
    data: flowSeries  
  });
};

//send the request to USGS
var sendRequest = function(request){
  $.ajax({
    url: "http://waterservices.usgs.gov/nwis/iv/?",
    format: "json",
    data: request,
    type: "GET",
  })
  //if json request works, call populateSeries() function so result variable
  //will be accessible
  .done(populateSeries)
  .fail(function(jqXHR, error){
    /*var errorElem = showError(error);
    $(".search-results").append(errorElem);*/
  })
};


//clear xData, yData, and gageName arrays
var resetData = function(){
  yData=[];
  xData=[];
  gageName=[];
};

///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

  getLocation();
  n = 0;
  //writeRequest() calls sendRequest();
  //sendRequest already calls populateSeries();
  
  $(".main").on("click","#leftArrow", function(){
    //click on arrow to reduce value of i by one
    n --;
    resetData();
    populateSeries();
      
  });
  $(".main").on("click", "#rightArrow", function(){
    n ++;
    resetData();
    populateSeries();
  });
});

////////////////////////////////////////////////////////////////////

