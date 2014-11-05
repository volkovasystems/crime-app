Crime
	.run( [
		"$rootScope",
		"Event",
		"Icon",
		function onRun( $rootScope, Event, Icon ){
			Event( $rootScope );

			Icon
				.setSourceList( [
					"../library/svg-sprite-navigation.svg",
					"../library/svg-sprite-content.svg",
					"../library/svg-sprite-editor.svg",
					"../library/svg-sprite-action.svg",
					"../library/svg-sprite-maps.svg"
				] )
				
				.requestAllSVGElementFromSourceList( function onFinished( ){
					$rootScope.publish( "all-icon-set-requested" );
				} );
		}
	] );