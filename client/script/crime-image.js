Crime

	.factory( "downloadImageList", [
		"Event",
		"ProgressBar",
		"$http",
		function factory(
			Event,
			ProgressBar,
			$http
		){
			var downloadImageList = function downloadImageList( scope, imageList, callback ){
				Event( scope );

				ProgressBar( scope );

				scope.startLoading( );

				async.parallel( _.map( imageList,
					function onEachImageItem( imageData ){
						var imageURL = imageData.URL;
						
						return ( function getImageData( callback ){
							$http.get( imageURL )
								.success( function onSuccess( response, status ){
									callback( null, response.data.imageRawData );
								} )
								.error( function onError( ){
									callback( null );
								} );
						} );
					} ),
						function lastly( error, rawImageList ){
							scope.finishLoading( );
							
							callback( error, _.compact( rawImageList ) );
						} );
			};

			return downloadImageList;
		}
	] )

	.directive( "imageController", [
		"Event",
		"downloadImageList",
		function directive( 
			Event,
			downloadImageList
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "download-image-list",
						function onDownloadImageList( imageList, callback ){
							downloadImageList( scope, imageList, callback );
						} );
				}
			}
		}
	] );