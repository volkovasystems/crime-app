angular
	
	.module( "ImageUpload", [ 
		"Event", 
		"PageFlow",
		"ImageGrid"
	] )
	
	.constant( "UPLOAD_IMAGES_PHRASE", labelData.UPLOAD_IMAGES_PHRASE )

	.factory( "ImageUpload", [
		"attachImageGrid",
		"UPLOAD_IMAGES_PHRASE",
		function factory( 
			attachImageGrid,
			UPLOAD_IMAGES_PHRASE
		){
			var ImageUpload = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageUploadComponent = (
							<ImageUpload 
								scope={ scope }
								container={ container } />
						);

						React.render( imageUploadComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"filePath": ""
					};
				},

				"onClickCloseImageUpload": function onClickCloseImageUpload( event ){
					
				},

				"onChangeFileSelection": function onChangeFileSelection( event ){
					var self = this;

					if( _.isEmpty( event.target.value ) ){
						//: @todo: Send notification?
						return;
					}

					if( "FileReader" in window ){
						var fileBrowser = event.target;

						var fileReader = new FileReader( );

						fileReader.onload = function onLoad( fileLoadedEvent ){
							var fileContent = fileLoadedEvent.target.result;

							self.scope.publish( "push-image-data", "image-upload",
								{
									"imageDisplaySource": fileContent,
									"imageFullSource": fileContent
								} );

							self.setState( {
								"filePath": ""
							} );
						};

						_.each( fileBrowser.files,
							function onEachFile( file ){
								fileReader.readAsDataURL( file );
							} );
					}
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "initiate-image-upload",
						function onInitiateImageUpload( ){
							var fileBrowserID = self.refs.fileBrowser.props.id;

							var query = [ "#", fileBrowserID ].join( "" );
							
							$( query, self.getDOMNode( ) ).click( );
						} );

					this.scope.on( "show-image-upload",
						function onShowImageUpload( ){
							self.scope.publish( "show-image-grid", "image-upload" );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"render": function onRender( ){
					var filePath = this.state.filePath;

					return; //: @template: template/image-upload.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					attachImageGrid( {
						"scope": this.scope,
						"element": $( ".image-grid", this.getDOMNode( ) ),
						"namespace": "image-upload"
					} );

					this.scope.publish( "image-upload-rendered" );
				}
			} );

			return ImageUpload;
		}
	] )

	.factory( "attachImageUpload", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageUpload",
		function factory( $rootScope, Event, PageFlow, ImageUpload ){
			var attachImageUpload = function attachImageUpload( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				scope.namespace = optionSet.namespace;

				Event( scope );

				var pageFlow = PageFlow( scope, element, "image-upload overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-image-upload",
					function onShowImageUpload( ){
						scope.showPage( );
					} );

				scope.on( "hide-image-upload",
					function onHideImageUpload( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-image-upload" );

				ImageUpload.attach( scope, element );
			};

			return attachImageUpload;
		}
	] )

	.directive( "imageUpload", [
		"attachImageUpload",
		function directive( attachImageUpload ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachImageUpload( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "image-upload"
					} );
				}
			}
		}
	] )