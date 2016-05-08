var myData = [];
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
		console.log(timeSeries);
		/*var searchResults = showSearchResults(tags, result.items.length);
		$(".search-results").html(searchResults);*/
		//myData = [result.timeSeries[3].values.dateTime,result.timeSeries[3].values.children().text()];
		$.each(timeSeries.values[0].value, function(i, value){
			
			myData.push({x:value.dateTime, y:value.value})

			
			/*var insperation = showInspiration(item);
			$(".results").append(insperation);*/
		});
		console.log(myData);
	})
	.fail(function(jqXHR, error){
		/*var errorElem = showError(error);
		$(".search-results").append(errorElem);*/
	});
};






$(document).ready(function(){
	getData();

	nv.addGraph(function() {
  		var chart = nv.models.lineChart()
                .margin({left: 100, right: 50})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .showLegend(false)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
  		;



  		chart.xAxis     //Chart x-axis settings
      	.axisLabel('Time (HH:MM)')
      	.tickFormat(d3.format(',r'));

  		chart.yAxis     //Chart y-axis settings
      	.axisLabel('Flow (cfs)')
      	.tickFormat(d3.format('.02f'));

  		/* Done setting the chart up? Time to render it!*/
  		//var myData = sinAndCos();   //You need data...

  		d3.select('svg')    //Select the <svg> element you want to render the chart in.   
      	.datum(myData)         //Populate the <svg> element with chart data...
      	.call(chart);          //Finally, render the chart!

  		//Update the chart when window resizes.
  		nv.utils.windowResize(function() { chart.update() });
  	return chart;
	});
	/**************************************
 		* Simple test data generator
 	*/
	function sinAndCos() {
  		var sin = [],sin2 = [],
      	cos = [];

  		//Data is represented as an array of {x,y} pairs.
  		for (var i = 0; i < 100; i++) {
    		sin.push({x: i, y: Math.sin(i/10)});
    		
  		}

  		//Line chart data should be sent as an array of series objects.
  		return [
    		{
      		values: sin,      //values - represents the array of {x,y} data points
      		key: 'cfs', //key  - the name of the series.
      		color: '#0F5498'  //color - optional: choose your own line color.
    		},
    
  		];
	}

});