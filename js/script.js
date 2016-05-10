
var flowSeries = {
	labels:[],
	datasets:[
			{
			strokeColor: black,
			data:[],
			xAxisID: "Time",
			yAxisID: "Flow (cfs)",
			fill:false,
			lineTension: 0,
			borderColor: white,
			pointRadius: 0,
			
			}
		],
	options: {
		scales:{
			xAxes: [{
				type: "time",
				gridLines.display: false,
				ticks.display: true
			}],
			time: {
        			// string/callback - By default, date objects are expected. You may use a pattern string from http://momentjs.com/docs/#/parsing/string-format/ to parse a time string format, or use a callback function that is passed the label, and must return a moment() instance.
        			parser: false,
        			// string - By default, unit will automatically be detected.  Override with 'week', 'month', 'year', etc. (see supported time measurements)
        			unit: false,

        			// Number - The number of steps of the above unit between ticks
        			unitStepSize: 1

        			// string - By default, no rounding is applied.  To round, set to a supported time unit eg. 'week', 'month', 'year', etc.
        			round: false,

        			// Moment js for each of the units. Replaces `displayFormat`
        			// To override, use a pattern string from http://momentjs.com/docs/#/displaying/format/
        			displayFormats: {
            				'millisecond': 'SSS [ms]',
            				'second': 'h:mm:ss a', // 11:20:01 AM
            				'minute': 'h:mm:ss a', // 11:20:01 AM
            				'hour': 'MMM D, hA', // Sept 4, 5PM
            				'day': 'll', // Sep 4 2015
            				'week': 'll', // Week 46, or maybe "[W]WW - YYYY" ?
            				'month': 'MMM YYYY', // Sept 2015
            				'quarter': '[Q]Q - YYYY', // Q3
            				'year': 'YYYY', // 2015
        			},
        			// Sets the display format used in tooltip generation
        			tooltipFormat: ''
    			},
		}
	}
}
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
			flowSeries.labels.push(value.dateTime)
			flowSeries.datasets.data.push(value.value)
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

	/*nv.addGraph(function() {
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

  		//Done setting the chart up? Time to render it!
  		var myData = getData();   //You need data...

  		d3.select('svg')    //Select the <svg> element you want to render the chart in.   
      	.datum(myData)         //Populate the <svg> element with chart data...
      	.call(chart);          //Finally, render the chart!

  		//Update the chart when window resizes.
  		nv.utils.windowResize(function() { chart.update() });
  	return chart;
  });*/
  getData();
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
