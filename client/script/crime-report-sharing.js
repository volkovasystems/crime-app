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

	.factory( "constructFacebookSharePinnedReportURL", [
		"Event",
		"getReportServerData",
		function factory( 
			Event,
			getReportServerData
		){
			var constructFacebookSharePinnedReportURL = function constructFacebookSharePinnedReportURL( scope, namespace, callback ){
				Event( scope );

				async.waterfall( [
					function getReportReference( callback ){
						scope.publish( "get-pinned-report-reference", namespace,
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

			return constructFacebookSharePinnedReportURL;
		}
	] )

	.factory( "constructTwitterSharePinnedReportURL", [
		"Event",
		"getReportServerData",
		function factory( 
			Event,
			getReportServerData
		){
			var constructTwitterSharePinnedReportURL = function constructTwitterSharePinnedReportURL( scope, namespace, callback ){
				Event( scope );

				async.waterfall( [
					function getReportReference( callback ){
						scope.publish( "get-pinned-report-reference", namespace,
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

			return constructTwitterSharePinnedReportURL;
		}
	] )

	.directive( "reportSharingController", [
		"Event",
		"constructFacebookShareReportURL",
		"constructTwitterShareReportURL",
		"constructFacebookSharePinnedReportURL",
		"constructTwitterSharePinnedReportURL",
		function directive( 
			Event, 
			constructFacebookShareReportURL,
			constructTwitterShareReportURL,
			constructFacebookSharePinnedReportURL,
			constructTwitterSharePinnedReportURL
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "initiate-facebook-sharing",	
						function onInitiateFacebookSharing( namespace, bypassDefaultProcedure ){
							if( scope.namespace == namespace ||
								( bypassDefaultProcedure && 
									!_.isEmpty( namespace ) ) )
							{
								if( bypassDefaultProcedure 
									&& !onInitiateFacebookSharing[ namespace ] )
								{
									onInitiateFacebookSharing[ namespace ] = true;

									constructFacebookSharePinnedReportURL( scope, namespace,
										function onResult( error, facebookShareReportURL ){
											if( error ){

											}else{
												scope.publish( "set-facebook-share-url", 
													namespace, facebookShareReportURL );	
											}

											var timeout = setTimeout( function onTimeout( ){
												onInitiateFacebookSharing[ namespace ] = false;	

												clearTimeout( timeout );
											}, 1000 );
										} );

								}else if( !bypassDefaultProcedure ){
									constructFacebookShareReportURL( scope,
										function onResult( error, facebookShareReportURL ){
											if( error ){

											}else{
												scope.publish( "set-facebook-share-url", 
													namespace, facebookShareReportURL );	
											}
										} );	
								}
							}
						} );

					scope.on( "initiate-twitter-sharing",	
						function onInitiateTwitterSharing( namespace, bypassDefaultProcedure ){
							if( scope.namespace == namespace ||
								( bypassDefaultProcedure && 
									!_.isEmpty( namespace ) ) )
							{
								if( bypassDefaultProcedure &&
									!onInitiateTwitterSharing[ namespace ] )
								{
									onInitiateTwitterSharing[ namespace ] = true;

									constructTwitterSharePinnedReportURL( scope, namespace,
										function onResult( error, twitterShareReportURL ){
											if( error ){

											}else{
												scope.publish( "set-twitter-share-url", 
													namespace, twitterShareReportURL );	
											}

											var timeout = setTimeout( function onTimeout( ){
												onInitiateTwitterSharing[ namespace ] = false;	

												clearTimeout( timeout );
											}, 1000 );
										} );
									
								}else if( !bypassDefaultProcedure ){
									constructTwitterShareReportURL( scope,
										function onResult( error, twitterShareReportURL ){
											if( error ){

											}else{
												scope.publish( "set-twitter-share-url", 
													namespace, twitterShareReportURL );	
											}
										} );
								}
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