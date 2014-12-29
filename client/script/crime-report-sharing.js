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
					function getReportReference( callback ){
						scope.publish( "get-report-reference",
							function onGetReportReference( error, reference ){
								callback( error, reference );
							} );
					},

					function constructShareReportURL( reference, callback ){
						var shareReportURL = getReportServerData( ).joinPath( "report/share/facebook/:reference" );

						shareReportURL = shareReportURL.replace( ":reference", reference );

						callback( null, shareReportURL );
					}
				], 
					function lastly( state, shareReportURL ){
						callback( state, shareReportURL );
					} );
			};

			return constructFacebookShareReportURL;
		}
	] )

	.factory( "constructTwitterShareReportURL", [
		"Event",
		"getReportServerData",
		function factory( 
			Event,
			getReportServerData
		){
			var constructTwitterShareReportURL = function constructTwitterShareReportURL( scope, callback ){
				Event( scope );

				async.waterfall( [
					function getReportReference( callback ){
						scope.publish( "get-report-reference",
							function onGetReportReference( error, reference ){
								callback( error, reference );
							} );
					},

					function constructShareReportURL( reference, callback ){
						var shareReportURL = getReportServerData( ).joinPath( "report/share/twitter/:reference" );

						shareReportURL = shareReportURL.replace( ":reference", reference );

						callback( null, shareReportURL );
					}
				], 
					function lastly( state, shareReportURL ){
						callback( state, shareReportURL );
					} );
			};

			return constructTwitterShareReportURL;
		}
	] )

	.directive( "reportSharingController", [
		"Event",
		"constructFacebookShareReportURL",
		"constructTwitterShareReportURL",
		function directive( 
			Event, 
			constructFacebookShareReportURL,
			constructTwitterShareReportURL
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

					scope.on( "initiate-twitter-sharing",	
						function onInitiateTwitterSharing( namespace ){
							if( scope.namespace == namespace ){
								constructTwitterShareReportURL( scope,
									function onResult( error, twitterShareReportURL ){
										if( error ){

										}else{
											scope.publish( "set-twitter-share-url", namespace, twitterShareReportURL );	
										}
									} );
							}
						} );

					scope.on( "report-sent",
						function onReportSent( ){
							scope.publish( "initiate-report-sharing", scope.namespace );

							scope.publish( "show-report-sharing", scope.namespace );
						} );
				}
			};
		}
	] );