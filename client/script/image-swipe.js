angular

	.module( "ImageSwipe", [ "Event", "PageFlow" ] )

	.factory( "ImageSwipe", [
		function factory( ){
			var ImageSwipe = function ImageSwipe( ){

			};

			return ImageSwipe;
		}
	] )

	.factory( "attachImageSwipe", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageSwipe",
		function factory(
			$rootScope,
			Event,
			PageFlow, 
			ImageSwipe
		){

		} 
	] )

	.directive( "imageSwipe", [
		"attachImageSwipe",
		function directive( attachImageSwipe ){
			
		}
	] );