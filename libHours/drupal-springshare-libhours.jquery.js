(function( $ ) {
 
    $.fn.getLibraryHours = function(options) {
 
		var target = this;

		// This is the easiest way to have default options.
        var settings = $.extend({
			url: "http://url/to/springshare/hours/api",
        	textPrefix: "Today's Hours: "
        }, options );
 

		// Using the core $.ajax() method
		$.ajax({
			// The URL for the request
			url: settings.url,
	 		// The data to send (will be converted to a query string)
			data: {
				location: settings.location
			},
			// Whether this is a POST or GET request
			type: "GET",
	 		// The type of data we expect back
			dataType : "json",
			// Code to run if the request succeeds;
			// the response is passed to the function
			success: function( json ) {
				if(json.hours){
					var text =  settings.textPrefix;
					if($.isArray(json.hours)){
						text += json.hours[0].from + "-" + json.hours[0].to;
					}else{
						text += json.hours;
					}
					target.text(text);
				}

			},
			// Code to run if the request fails; the raw request and
			// status codes are passed to the function
			error: function( xhr, status, errorThrown ) {
				//console.log( "Error: " + errorThrown );
				//console.log( "Status: " + status );
				//console.dir( xhr );
			},
			// Code to run regardless of success or failure
			complete: function( xhr, status ) {

			}
		});

        return this;
    };
 
}( jQuery ));