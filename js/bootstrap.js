// once jQuery is done loading, we can start to instantiate the objects that will run our application
$(document).ready(function(){

	// instantiate the MVC components
	var model = new app.model();
	var view = new app.view("leftArrow", "rightArrow", "currentGage", "totalGages");
	var controller = new app.controller(view, model);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(data){
			controller.run(data);
		});
	}
	else {
		$('#graphContainer').html("Geolocation is not supported by this browser.");
	}

});