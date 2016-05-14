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

 //create an array to track each site's flowSeries
 var sites = [];
//populate flowSeries object with the results
var populateSeries = function(results){
  console.log(results);
  //show how many results
  var numberOfSites = results.value.timeSeries.length;
  $(".graph h5").html(n+" of "+numberOfSites+" gages near you");
  for (i=0; i<numberOfSites; i++){
    //define data arrays and clear each round
    var yData = [];
    var xData = [];
    var gageName = "";
     //show the name of the result
    gageName=results.value.timeSeries[i].sourceInfo.siteName;
    //go through each x,y pair in that timeseries's results. 
    $.each(results.value.timeSeries[i].values[0].value, function(i, value){
    var timestamp=moment(value.dateTime);
    timestamp.format("d MMM HH:mm");
    xData.push(timestamp);
    var flowValue = parseInt(value.value);
    yData.push(flowValue);
    });
       //include options for flowSeries
    var options = {scales: {
                  xAxes:[{
                    //type: "time",
                    position: "bottom",
                    //time: {
                      //parser: true,
                      //round: "hour"
                    //},
                    scaleLabel:{
                      labelString: "time"
                    }
                  }],
                  yAxes:[{
                    type: "linear",
                    id: "flow (cfs)"
                  }]  
                }  
    };
    //flowSeries is the data object that is populated from USGS json
    var flowSeries = {
      labels:xData,
      datasets:[{
          label: gageName,
          pointStrokeColor: "#fff",
          strokeColor: "rgba(220,220,220,1)",
          data:yData 
      }],
      options: options
    };
   
    sites.push(flowSeries);
  };
 
  console.log(flowSeries);
  var hydrograph = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(hydrograph,{
    type: "line",
    data: sites[0]
  });
};

///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

  getLocation();
  n = 0;
  //when left arrow click, reduce the value of n by 1  
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

