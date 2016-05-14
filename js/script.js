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
    period: "P5D",
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
//create a global variable that will count the number of sites
var numberOfSites = 0;
//populate flowSeries object with the results
var populateSeries = function(results){
  numberOfSites = results.value.timeSeries.length;
  //populate flowSeries object for each timeSeries
  for (i=0; i<numberOfSites; i++){
    //define data arrays and clear each round
    var yData = [];
    var xData = [];
    var gageName = "";
     //show the name of the result
    gageName=results.value.timeSeries[i].sourceInfo.siteName;
    //go through each x,y pair in that timeseries's results. 
    $.each(results.value.timeSeries[i].values[0].value, function(i, value){
      var timestamp = moment(value.dateTime).format("MM/DD HH:mm");
      xData.push(timestamp);
      var flowValue = parseInt(value.value);
      yData.push(flowValue);
      });
    console.log(flowSeries);
    //include options for flowSeries
    var options = { 
      scaleShowLabels: true,
      responsive: true,
      tooltips:{
        enabled: false
      },
      showTooltips: false,
      maintainAspectRatio: false,
      customTooltips: false,
      scales:{
        xAxes: [{
          type: "time",
          time:{
            parser: true
            
          }
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
          data:yData,
          borderColor: '#0F5498',
          pointRadius: 0,
          fill: false
      }],
      options: options
    };
   
    sites.push(flowSeries);
  };
  //once the site series has been populated, show the graph
  drawGraph();
};

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
      n++;
      drawGraph();
    }
  });

  $(".main").on("click", "#rightArrow", function(){
    if (n<numberOfSites){
      n++;
      drawGraph();
    }
    else{
      n--;
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
    }
  });

});

////////////////////////////////////////////////////////////////////

