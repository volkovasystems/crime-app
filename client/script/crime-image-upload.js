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

					scope.on( "show-image-upload",
						function onShowImageUpload( ){
							scope.publish( "set-control-list",
								[
									{
										"reference": "crime-image-upload",
										"name": "image-upload-control-group",
										"isSeparateGroup": true,
										"controlList": [
											{
												"reference": "crime-image-upload",
												"name": "crime-image-upload-cancel",
												"title": "cancel",
												"icon": "ic_cancel_24px"
											},
											{
												"reference": "crime-image-upload",
												"name": "crime-image-upload-select-image",
												"title": "select image",
												"icon": "ic_add_to_photos_24px"
											},
											{
												"reference": "crime-image-upload",
												"name": "crime-image-upload-upload-image",
												"title": "upload image",
												"icon": "ic_cloud_upload_24px"
											},
											{
												"reference": "crime-image-upload",
												"name": "crime-image-upload-remove-image",
												"title": "remove image",
												"icon": "ic_cloud_upload_24px"
											}
										]
									}
								], true );

							scope.publish( "set-hidden-control-list", [ "crime-image-upload-remove-image" ] );
							
							scope.publish( "show-control" );
						} );

					scope.on( "hide-image-upload",
						function onHideImageUpload( ){
							scope.publish( "remove-control", "crime-image-upload" );
						} );
				}
			};
		}
	] );