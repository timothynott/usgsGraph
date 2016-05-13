var long = "";
var lat = "";
var longExt="";
var latExt = "";
var n = 0;
 
 var getLocation = function() {
    if (navigator.geolocation) {
      //anonymous function
        navigator.geolocation.getCurrentPosition(function(position){
        long=position.coords.longitude.toString().slice(0,11);
        lat=position.coords.latitude.toString().slice(0,9);
        longExt=(position.coords.longitude+1).toString().slice(0,11);
        latExt=(position.coords.latitude+1).toString().slice(0,9);
        });
        
          //have to put getData() function here so that long, lat coord values are remembered
          
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
  
var getData = function(lng, lt, xlng, xlt){
  long = (lng)?lng:long;
  lat = (lt)?lt:lat;
  longExt = (xlng)?xlng:longExt;
  latExt = (xlt)?xlt:latExt;
  
  var request = {
    bBox: lng+","+lt+","+xlng+","+xlt,
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
    gageName.push(result.value.timeSeries[n].sourceInfo.siteName);
    console.log(gageName);
      //go through each x,y pair in the specified timeSeries
      $.each(result.value.timeSeries[n].values[0].value, function(i, value){
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
  n = 0;
  getData(lng, lt, xlng, xlt);
  
  $(".main").on("click","#leftArrow", function(){
    //click on arrow to reduce value of i by one
    n --;
    resetData();
    getData(long, lat, longExt, latExt);
      
  });
  $(".main").on("click", "#rightArrow", function(){
    n ++;
    resetData();
    getData(long, lat, longExt, latExt);
  });
});

////////////////////////////////////////////////////////////////////

