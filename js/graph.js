


var drawGraph = function(){
  $(".graph h5").html(n+" of "+numberOfSites+" gages near you");
  var hydrograph = document.getElementById('graph').getContext('2d');
  var myChart = new Chart(hydrograph,{
    type: "line",
    data: sites[n]
  });
};
