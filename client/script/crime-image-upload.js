Crime

	.factory( "uploadImageList", [
		"Event",
		"ProgressBar",
		"$http",
		"getStaticServerData",
		function factory(
			Event,
			ProgressBar,
			$http,
			getStaticServerData
		){
			var uploadImageList = function uploadImageList( scope, imageList, callback ){
				Event( scope );

				ProgressBar( scope );

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

					function prepareImageList( userData, callback ){
						var xxHash = XXH( 0xCAFE );
						
						var imageList = _.map( imageList,
							function onEachImageItem( rawImage ){
								var imageTimestamp = Date.now( );

								var imageHash = [
									XXH( imageTimestamp, 0xCAFE ).toString( 16 ),
									( new jsSHA( rawImage, "TEXT" ) ).getHash( "SHA-512", "HEX" );
								].join( "-" );

								var imageID = [
									uuid.v4( ),
									imageHash
								].join( "-" );

								var imageReference = ( new jsSHA( imageHash, "TEXT" ) ).getHash( "SHA-512", "HEX" )

								var imageRawData = rawImage;

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

								var imageURL = [
									currentHostAddress,
									
								];

								return {
									"imageTimestamp": imageTimestamp,
									"imageHash": imageHash,
									"imageID": imageID,
									"imageReference": imageReference,
									"imageRawData": imageRawData
								};
							} );

						callback( null, userData, imageList );
					},

					function uploadImageList( accessID, imageList, callback ){

					}
				],
					function lastly( ){

					} );
			};

			return uploadImageList;
		}
	] )

	.directive( "imageUploadController", [
		"Event",
		"uploadImageList",
		function directive( 
			Event,
			uploadImageList
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					scope.on( "open-image-upload",
						function onOpenImageUpload( ){
							scope.publish( "show-image-upload" );

							scope.publish( "initiate-image-upload" );
						} );

					scope.on( "close-image-upload",
						function onOpenImageUpload( ){
							scope.publish( "hide-image-upload" );

							scope.publish( "clear-image-upload-data" );
						} );

					scope.on( "upload-image-list",
						function onUploadImageList( imageList, callback ){
							uploadImageList( scope, imageList, callback );
						} );
				}
			}
		}
	] );