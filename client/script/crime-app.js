var Crime = angular.module( "Crime", [ "App", "Login" ] );

Crime
	.run( [
		"Login",
		function onRun( Login ){
			//Login.
		}
	] )