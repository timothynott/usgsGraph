var long = "";
var lat = "";
var longExt="";
var latExt = "";
 
 var getLocation = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
          long=position.coords.longitude.toString().slice(0,11);
          lat=position.coords.latitude.toString().slice(0,9);
          longExt=(position.coords.longitude+1).toString().slice(0,11);
          latExt=(position.coords.latitude+1).toString().slice(0,9);
          //have to put getData() function here so that long, lat coord values are remembered
           getData(long, lat, longExt, latExt);
        });
        
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
};

var resetData = function(){
  yData=[];
  xData=[];
  gageName=[];
};

 var yData = [];
 var xData = [];
 var gageName = [];
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
  
var options = {scaleShowGridLines : true, scaleShowVerticalLines: true};
  
var getData = function(long, lat, longExt, latExt){
  var request = {
    bBox: long+","+lat+","+longExt+","+latExt,
    period: "P1D",
    parameterCD: "00060",
    siteType:"ST",
    siteStatus: "active",
    format: "json",
  }
  $.ajax({
    url: "http://waterservices.usgs.gov/nwis/iv/?",
    format: "json",
    data: request,
    type: "GET",
  })
  .done(function(result){
    $(".graph h5").html("1 of "+result.value.timeSeries.length+" gages near you");
    numberOfTimeSeries = result.value.timeSeries.length;
    gageName.push(result.value.timeSeries[i].sourceInfo.siteName);
    console.log(gageName);
      //go through each x,y pair in the specified timeSeries
      $.each(result.value.timeSeries[i].values[0].value, function(i, value){
        xData.push(value.dateTime);
        yData.push(parseInt(value.value));
      })
    var hydrograph = document.getElementById('graph').getContext('2d');
    var myChart = new Chart(hydrograph,{
          type: "line",
          data: flowSeries  
      });
    
  })
  .fail(function(jqXHR, error){
    /*var errorElem = showError(error);
    $(".search-results").append(errorElem);*/
  })
};

///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

  getLocation();
  //getData();
  i = 0;
 
  
  $(".main").on("click","#leftArrow", function(){
    //click on arrow to reduce value of i by one
    i --;
    resetData();
    getData();
      
  });
  $(".main").on("click", "#rightArrow", function(){
    i ++;
    resetData();
    getData();
  })
});

////////////////////////////////////////////////////////////////////

