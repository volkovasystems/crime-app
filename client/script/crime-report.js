Crime

	.factory( "sendReport", [
		"Event",
		"ProgressBar",
		"$http",
		"getReportServerData",
		"getAppServerData",
		"getStaticServerData",
		function factory( 
			Event, 
			ProgressBar, 
			$http,
			getReportServerData,
			getAppServerData
		){
			var sendReport = function sendReport( scope, callback ){
				callback = callback || function callback( ){ };

				ProgressBar( scope );

				Event( scope );

				async.waterfall( [
					function initiateLoading( callback ){
						scope.startLoading( );

						callback( );
					},

					function getUserData( callback ){
						scope.publish( "get-user-account-data",
							function onGetUserAccountData( error, userAccountData ){
								callback( error, userAccountData );
							} );
					},

					function getBasicProfileData( userAccountData, callback ){
						scope.publish( "get-basic-profile-data",
							function onGetBasicProfileData( error, userProfileData ){
								var profileURL = new URI( userProfileData.profileURL );
								profileURL = userProfileData.profileURL.replace( profileURL.search( ), "" );
								userProfileData.cleanProfileURL = profileURL;

								var profileImage = new URI( userProfileData.profileImage );
								profileImage = userProfileData.profileImage.replace( profileImage.search( ), "" );
								userProfileData.cleanProfileImage = profileImage.split( "/" ).reverse( )[ 0 ];

								callback( error, userAccountData, userProfileData );
							} );
					},

					function processUserData( userAccountData, userProfileData, callback ){
						var userData = [
							[ "userID", 		userAccountData.userID ],
							[ "profileName", 	userProfileData.profileName ],
							[ "profileURL", 	userProfileData.cleanProfileURL ],
							[ "profileImage", 	userProfileData.cleanProfileImage ]
						];

						var hashedValue = btoa( JSON.stringify( userData ) ).replace( /[^A-Za-z0-9]/g, "" );
						userData.userID = hashedValue;

						var accessID = btoa( userAccountData.accessToken ).replace( /[^A-Za-z0-9]/g, "" );
						userData.accessID = accessID;

						callback( null, userData );
					},

					function getReportSpecifyCategoryData( userData, callback ){
						scope.publish( "get-report-specify-category-data",
							function onGetReportSpecifyCategoryData( error, reportSpecifyCategoryData ){
								callback( error, userData, reportSpecifyCategoryData );
							} );
					},

					function getReportIncidentDetailData( userData, reportSpecifyCategoryData, callback ){
						scope.publish( "get-report-incident-detail-data",
							function onGetReportIncidentDetailData( error, reportIncidentDetailData ){
								callback( error, userData, reportSpecifyCategoryData, reportIncidentDetailData );
							} );
					},

					function processReportData( userData, reportSpecifyCategoryData, reportIncidentDetailData, callback ){
						callback( null, 
							userData, 
							{
								"staticMapURL": reportSpecifyCategoryData.staticMapURL,
								"category": 	reportSpecifyCategoryData.selectedCaseCategory,
								"latitude": 	reportSpecifyCategoryData.latitude,
								"longitude": 	reportSpecifyCategoryData.longitude,
								"zoom": 		reportSpecifyCategoryData.zoom,
								"title": 		reportIncidentDetailData.title,
								"description": 	reportIncidentDetailData.description,
								"anonymous": 	reportIncidentDetailData.anonymous,
								"timestamp": 	reportIncidentDetailData.timestamp
							} );
					},

					function getCaseCategoryTitle( userData, reportData, callback ){
						scope.publish( "get-case-category-list",
							function onGetCaseCategoryList( error, caseCategoryList ){
								if( error ){
									callback( error );
								
								}else{
									var caseCategoryTitle = _.find( caseCategoryList,
										function onEachCaseCategoryItem( caseCategoryData ){
											return caseCategoryData.name == reportData.category;
										} ).title;

									reportData.caseCategoryTitle = caseCategoryTitle;

									callback( null, userData, reportData );	
								}
							} );
					},

					function getReportAddress( userData, reportData, callback ){
						var position = new google.maps.LatLng( reportData.latitude, reportData.longitude );
						
						scope.publish( "get-address-at-position",
							position,
							function onGetAddressAtPosition( error, address ){
								if( error ){
									callback( error );

								}else{
									reportData.address = address;

									callback( null, userData, reportData );
								}
							} );
					},

					function applyServerFormat( userData, reportData, callback ){
						var hashedValue = btoa( JSON.stringify( reportData ) );

						var latitude = reportData.latitude;
						var radianLatitude = math.unit( latitude, "deg" ).to( "rad" ).value;

						var longitude = reportData.longitude;
						var radianLongitude = math.unit( longitude, "deg" ).to( "rad" ).value;

						/*:
							Note that reportReferenceID and reportShareURL
								are not part of the hashedValue.

							Because, they are extremely dynamic.

							Changes to the reportTitle may invoke a change
								in the reportShareURL but not the reportReferenceID.
						*/

						var reportReferenceTitle = reportData.title
							.trim( )
							.replace( /[^a-zA-Z0-9\s]+/g, "" )
							.replace( /\s+/g, "-" )

						var reportReferenceID = btoa( [
								reportData.timestamp,
								reportReferenceTitle
							].join( ":" ) );

						var uri = new URI( );
						var currentHostAddress = [ 
							"http:/",
							uri.host( )
						].join( "/" );

						if( !( /https?/ ).test( uri.protocol( ) ) &&
							window.production )
						{
							currentHostAddress = getStaticServerData( ).joinPath( "" );
						}

						var reportShareURL = [
							currentHostAddress,
							URI.buildQuery( {
								"action": "show-pinned-report",
								"reference": reportReferenceTitle
							} )
						].join( "?" )

						var formattedReportData = {
							"reportID": 			hashedValue,
							"reporterID": 			userData.userID,
							"reporterState": 		reportData.anonymous,
							"reportTimestamp": 		reportData.timestamp,
							"reportLocation": {
								"latitude": 		latitude,
								"longitude": 		longitude,
								"zoom": 			reportData.zoom,
								"coordinate": 		[
														radianLongitude,
														radianLatitude
													]
							},
							"reportMapImageURL": 	reportData.staticMapURL,
							"reportTitle": 			reportData.title,
							"reportDescription": 	reportData.description,
							"reportCaseType": 		reportData.category,
							"reportCaseTitle": 		reportData.caseCategoryTitle,
							"reportAddress": 		reportData.address,
							"reportReferenceTitle": reportReferenceTitle, 
							"reportReferenceID": 	reportReferenceID,
							"reportShareURL": 		reportShareURL
						};

						callback( null, userData, formattedReportData );
					},

					function sendReportData( userData, reportData, callback ){
						var requestEndpoint = getReportServerData( ).joinPath( "api/:accessID/report/add" );

						requestEndpoint = requestEndpoint.replace( ":accessID", userData.accessID );

						$http.post( requestEndpoint, reportData )
							.success( function onSuccess( response, status ){
								if( response.status == "failed" ){
									callback( response.data );

								}else{
									callback( null, userData, reportData );
								}
							} )
							.error( function onError( response, status ){
								callback( new Error( "error sending report data" ) );
							} );
					},

					function sendReportStateData( userData, reportData, callback ){
						var requestEndpoint = getAppServerData( ).joinPath( "api/:accessID/report/pending" );

						requestEndpoint = requestEndpoint.replace( ":accessID", userData.accessID );

						$http
							.post( requestEndpoint, {
								"reportID": reportData.reportID,
								"reporterID": reportData.reporterID
							} )
							.success( function onSuccess( response, status ){
								if( response.status == "failed" ){
									callback( response.data );

								}else{
									callback( null );
								}
							} )
							.error( function onError( response, status ){
								callback( new Error( "error sending report state data" ) );
							} );
					}
				],
					function lastly( state ){
						scope.finishLoading( );

						if( typeof state == "string" ){
							callback( state )

						}else if( state instanceof Error ){
							callback( state );

						}else{
							callback( null );
						}
					} );
			};

			return sendReport;	
		}
	] )

	.directive( "reportController", [
		"sendReport",
		function directive( sendReport ){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					scope.on( "send-report",
						function onSendReport( ){
							sendReport( scope,
								function onSendReport( state ){
									if( state ){

									}else{
										scope.publish( "report-sent" );
									}
								} );
						} );
				}
			}
		}
	] );