var makeFlowSeries = function(yData, xData, gageName){
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
      }]  
  };
    //add this flowSeries object to the sites array
    sites.push(flowSeries);
};


var drawGraph = function(){
  $(".graph h5").html((n+1)+" of "+numberOfSites+" gages near you");
  var hydrograph = document.getElementById('graph').getContext('2d');
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
              labelString: "Time"
            },
            time:{
              parser: true,
              unit: "day",
              unitStepSize: 1,
              displayFormats: {
                'hour': 'HH:mm', // 13:00
                'day': 'DD MMM', // 04 June
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
};


