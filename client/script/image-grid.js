angular

	.module( "ImageGrid", [ "Event", "PageFlow" ] )

	.factory( "ImageGrid", [
		function factory( ){
			var ImageGrid = function ImageGrid( ){

			};

			return ImageGrid;
		}
	] )

	.factory( "attachImageGrid", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageGrid",
		function factory(
			$rootScope,
			Event,
			PageFlow, 
			ImageGrid
		){

		} 
	] )

	.directive( "imageGrid", [
		"attachImageGrid",
		function directive( attachImageGrid ){

		}
	] );