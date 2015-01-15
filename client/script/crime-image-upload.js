Crime

	.directive( "imageUploadController", [
		"Event",
		function directive( Event ){
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
				}
			}
		}
	] );