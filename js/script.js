 var yData = [];
 var xData = [];
 var flowSeries = {
      labels:xData,
      datasets:[{
          //label: gageName,
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
  
var gageName = "";
var getData = function(){
  var request = {
    bBox: "-83.000000,38.000000,-82.500000,38.500000",
    period: "P1D",
    parameterCD: "00060",
    siteType:"ST",
    format: "json",
  }
  $.ajax({
    url: "http://waterservices.usgs.gov/nwis/iv/?",
    format: "json",
    data: request,
    type: "GET",
  })
  .done(function(result){
    var siteData = result.value.timeSeries[0];
    var gageName = siteData.sourceInfo.siteName;

    /*var searchResults = showSearchResults(tags, result.items.length);
    $(".search-results").html(searchResults);*/
    //myData = [result.timeSeries[3].values.dateTime,result.timeSeries[3].values.children().text()];
    $.each(result.value.timeSeries[0].values[0].value, function(i, value){
      xData.push(value.dateTime);
      yData.push(parseInt(value.value));
      
      //.slice(11,16)
      //.replace(":","")
      /*var insperation = showInspiration(item);
      $(".results").append(insperation);*/
    })
    var hydrograph = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(hydrograph,{
    type: "line",
    //borderWidth: 1px,
    data: flowSeries
  });
  })
  .fail(function(jqXHR, error){
    /*var errorElem = showError(error);
    $(".search-results").append(errorElem);*/
  })
};

var showData = function(gageName){
  //flowSeries.datasets.label.val(gageName);
};




///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

  getData();
  showData();
  

  
});

////////////////////////////////////////////////////////////////////

