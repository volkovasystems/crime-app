angular
	.module( "ImageUpload", [ 
		"Event", 
		"PageFlow", 
		"Icon", 
		"PathInput",
		"ThumbnailList"
	] )
	
	.value( "IMAGE_UPLOAD_HEADER_LABEL", "upload an image" )

	.factory( "ImageUpload", [
		"Icon",
		"PathInput",
		"ThumbnailList",
		"IMAGE_UPLOAD_HEADER_LABEL",
		function factory( 
			Icon, 
			PathInput,
			ThumbnailList,
			IMAGE_UPLOAD_HEADER_LABEL
		){
			var ImageUpload = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageUploadComponent = <ImageUpload scope={ scope }/>

						React.render( <ImageUpload scope={ scope }/>, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"imagePath": "",
						"imageList": [ ],
						"selectedImageList": [ ],
						"imageUploadState": "image-upload-empty",
						"componentState": "image-upload-normal"
					};
				},

				"onChangeFileSelection": function onChangeFileSelection( event ){
					var selectedFileList = $( event.currentTarget )[ 0 ].files;


					if( selectedFileList.length > 0 ){
						_.each( selectedFileList,
							function onEachSelectedFile( rawFileData ){
								var encodedFile = URL.createObjectURL( rawFileData );
								var fileName = rawFileData.name;

								console.debug( encodedFile, fileName, rawFileData );			
							} );
					}else{
						//: User does not select anything.
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "image-upload:open-file-browser",
						function onOpenFileBrowser( ){
							$( self.refs.fileBrowser ).click( );
						} );
					
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var imagePath = this.state.imagePath;

					var imageList = this.state.imageList;

					var selectedImageList = this.state.selectedImageList;

					return ( 
						<div 
							className={ [
								"image-upload-container",
							].join( " " ) }>
							<div 
								className={ [
									"image-upload-component",
								].join( " " ) }>

								<div 
									className={ [
										"image-upload-header"
									].join( " " ) }>
									<div
										className={ [
											"header-icon",
											"shown",
											"inline-block"
										].join( " " ) }>
										<Icon name="ic_image_24px" />
									</div>

									<div
										className={ [
											"header-title",
											"shown",
											"inline-block"
										].join( " " ) }>
										<span>
											{ IMAGE_UPLOAD_HEADER_LABEL.toUpperCase( ) }
										</span>
									</div>

									<div 
										className={ [
											"close-image-upload-button",
											"shown",
											"inline-block"
										].join( " " ) }
										onClick={ this.onClickCloseImageUploadButton }>
										<a 
											className={ [
												"action-element"
											].join( " " ) }
											href={ [
												"#",
												"close-image-upload"
											].join( "/" ) }
											style={
												{
													"display": "block"
												}
											}>
											
											<Icon
												className={ [
													"close-image-upload-icon"
												].join( " " ) }
												name="ic_close_24px" />
										</a>
									</div>
								</div>

								<div
									className={ [
										"image-upload-body"
									].join( " " ) }>

									<div
										className={ [
											"image-upload-form"
										].join( " " ) }>

										<PathInput 
											parent={ this }
											title="image path"
											titleName="imagePath"
											pathInput={ imagePath } />

										<ThumbnailList 
											parent={ this }
											titleName="selectedImageList"
											thumbnailList={ imageList }
											selectedThumbnailList={ selectedImageList } />

										<input 
											ref="fileBrowser"
											type="file"
											style={
												{
													"height": "0px",
													"width": "0px"
												}
											} 
											onChange={ this.onChangeFileSelection }/>

									</div>
								</div>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "image-upload-rendered" );
				}
			} );

			return ImageUpload;
		}
	] )
	
	.directive( "imageUpload", [
		"Event",
		"PageFlow",
		"ImageUpload",
		function directive( Event, PageFlow, ImageUpload ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "image-upload" );

					scope.on( "show-image-upload",
						function onShowImageUpload( ){
							scope.showPage( );
						} );

					scope.on( "hide-image-upload",
						function onHideImageUpload( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-image-upload" );

					ImageUpload
						.attach( scope, element );
				}
			};
		}
	] );