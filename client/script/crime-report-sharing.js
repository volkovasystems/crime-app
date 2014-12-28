Crime
	.factory( "constructFacebookShareReportURL", [
		"Event",
		"getReportServerData",
		function factory( 
			Event,
			getReportServerData
		){
			var constructFacebookShareReportURL = function constructFacebookShareReportURL( scope, callback ){
				Event( scope );

				async.waterfall( [
					function getReference( callback ){
						scope.publish( "get-report-reference",
							function onGetReportReference( error, reference ){
								callback( error, reference );
							} );
					},

					function constructURL( reference, callback ){
						var shareReportURL = getReportServerData( ).joinPath( "report/share/facebook/:reference" );

						shareReportURL = shareReportURL.replace( ":reference", reference );

						callback( null, shareReportURL );
					}
				], callback );
			};

			return constructFacebookShareReportURL;
		}
	] )

	.directive( "reportSharingController", [
		"Event",
		"constructFacebookShareReportURL",
		function directive( 
			Event, 
			constructFacebookShareReportURL
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "initiate-facebook-sharing",	
						function onInitiateFacebookSharing( namespace ){
							if( scope.namespace == namespace ){
								constructFacebookShareReportURL( scope,
									function onResult( error, facebookShareReportURL ){
										if( error ){

										}else{
											scope.publish( "set-facebook-share-url", namespace, facebookShareReportURL );	
										}
									} );
							}
						} );

					scope.on( "show-report-final",
						function onShowReportFinal( ){
							scope.publish( "initiate-report-sharing", scope.namespace );
						} );

					scope.on( "report-sent",
						function onReportSent( ){
							scope.publish( "show-report-sharing", scope.namespace );
						} );
				}
			};
		}
	] );