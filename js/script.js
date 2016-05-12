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
    $(".graph h5").html("1 of "+result.value.timeSeries.length+"gages near you");
    console.log(result);
    gageName.push(result.value.timeSeries[i].sourceInfo.siteName);
    console.log(gageName);
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
  i = 0;
  getData();
  $(".main").on("click","#leftArrow", function(){
      i --;
      getData();
  });
  $(".main").on("click", "#rightArrow", function(){
    i ++;
    getData();
  })
});

////////////////////////////////////////////////////////////////////

