
var flowSeries = [];
var gageName = "";
var getData = function(){

	var request = {
		bBox: "-83.000000,38.000000,-82.500000,38.500000",
		period: "P1D",
		parameterCD: "00060",
		siteType:"ST",
		format: "json",
	};
	$.ajax({
		url: "http://waterservices.usgs.gov/nwis/iv/?",
		format: "json",
		data: request,
		type: "GET",
	})
	.done(function(result){
		var timeSeries = result.value.timeSeries[0];
		/*var searchResults = showSearchResults(tags, result.items.length);
		$(".search-results").html(searchResults);*/
		//myData = [result.timeSeries[3].values.dateTime,result.timeSeries[3].values.children().text()];
		$.each(timeSeries.values[0].value, function(i, value){
			flowSeries.push({x:value.dateTime.slice(11,16).replace(":",""), y:value.value})
			//.slice(11,16)
			//.replace(":","")
			/*var insperation = showInspiration(item);
			$(".results").append(insperation);*/
		});
    gageName = timeSeries.sourceInfo.siteName;
    console.log(gageName);
		console.log(typeof(flowSeries[0].x));
	})
	.fail(function(jqXHR, error){
		/*var errorElem = showError(error);
		$(".search-results").append(errorElem);*/
	});
	return [
    		{
      		values: flowSeries,      //values - represents the array of {x,y} data points
      		key: 'cfs', //key  - the name of the series.
      		color: '#0F5498'  //color - optional: choose your own line color.
    		},
    
  		];
};

var showData = function(gageName){
  console.log(gageName);
  $(".content>.graph>h4").text(gageName);
};
///////////////////////////////ON LOAD////////////////////////////////
$(document).ready(function(){

	nv.addGraph(function() {
  		var chart = nv.models.lineChart()
                .margin({left: 100, right: 50})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
		.x(function(d){ return Date(d.x);})
  		;

  		chart.xAxis     //Chart x-axis settings
      	.axisLabel('Time (Hour)')
      	//.scale(d3.time.day)

      	//.tickFormat(function(d){
      		//return d3.time.format("%H:%M") (d);
      	//}); 
     	.tickFormat(function(d){return d3.time.format("%d") (d)});
      	//d3.time.format('%H'));
		chart.xScale = d3.time.scale();

  		chart.yAxis     //Chart y-axis settings
      	.axisLabel('Flow (cfs)')
      	.tickFormat(d3.format(',.0f'));

  		//Done setting the chart up? Time to render it!*/
  		var myData = getData();   //You need data...

  		d3.select('svg')    //Select the <svg> element you want to render the chart in.   
      	.datum(myData)         //Populate the <svg> element with chart data...
      	.call(chart);          //Finally, render the chart!

  		//Update the chart when window resizes.
  		nv.utils.windowResize(function() { chart.update() });
  	return chart;
  });
  showData();
});

	//*************************************
 		// Simple test data generator
 	
	/*function sinAndCos() {
  		var sin = []

  		//Data is represented as an array of {x,y} pairs.
  		for (var i = 0; i < 100; i++) {
    		sin.push({x: i, y: Math.sin(i/10)});
    		
  		}
  		console.log(sin);
  		//Line chart data should be sent as an array of series objects.
  		return [
    		{
      		values: sin,      //values - represents the array of {x,y} data points
      		key: 'cfs', //key  - the name of the series.
      		color: '#0F5498'  //color - optional: choose your own line color.
    		},
    
  		];
	}*/
