var histogram = document.getElementById('buyers').getContext('2d');
new Chart(histogram).Line(myData);

/*var myLineChart = new Chart(ctx, {
    type: 'line',
    data: getData(),
    options: {
      xAxisID: "Time",
      yAxisID: "Flow (cfs)",
      fill:false,
      borderColor: black
    }*/
    
});
