angular

	.module( "ImageUploadGrid", [ "Event", "PageFlow" ] )
	
	.factory( "ImageUploadGrid", [
		function factory( ){
			var ImageUploadGrid = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageUploadGridComponent = (
							<ImageUploadGrid
								scope={ scope } />
						);

						React.render( imageUploadGridComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"imageList": [ ],
						"imageUploadGridLayout": "",
						"selectedImageList": [ ],
						"pendingImageList": [ ],
						"processedImageList": [ ],
						"failedImageList": [ ]
					};
				},

				"onClickCloseImageUploadGrid": function onClickCloseImageUploadGrid( event ){
					
				},

				"onClickImageItem": function onClickImageItem( event ){
					var selectedImageList = _.clone( this.state.selectedImageList );

					var imageReference = $( event.currentTarget ).attr( "value" );

					if( !_.contains( selectedImageList, imageReference ) ){
						selectedImageList.push( imageReference );

						this.setState( {
							"selectedImageList": selectedImageList
						} );

					}else{
						selectedImageList = _.without( selectedImageList, imageReference );

						this.setState( {
							"selectedImageList": selectedImageList
						} );
					}
				},

				"onEachImageItem": function onEachImageItem( imageData, index ){
					var selectedImageList = this.state.selectedImageList;
					var processedImageList = this.state.processedImageList;
					var pendingImageList = this.state.pendingImageList;
					var failedImageList = this.state.failedImageList;

					var imageFullSource = imageData.imageFullSource;

					var hashObject = new jsSHA( imageFullSource, "TEXT" );
					var hash = hashObject.getHash( "SHA-512", "HEX" );
					var key = hash;

					var imageReference = hash.substring( 0, 5 );

					var isSelected = _.contains( selectedImageList, imageReference );
					var isPending = _.contains( pendingImageList, imageReference );
					var isProcessed = _.contains( processedImageList, imageReference );
					var isFailed = _.contains( failedImageList, imageReference );

					var size = $( this.getDOMNode( ) ).width( ) / 3;

					size = size - 20;

					size = [ size, "px" ].join( "" );

					if( this.state.imageList.length == ( index + 1 ) ){
						var self = this;

						var timeout = setTimeout( function onTimeout( ){
							$( ".image-container img", self.getDOMNode( ) )
								.imgCentering( {
									"forceSmart": true
								} );

							clearTimeout( timeout );
						}, 0 );
					}

					return; //: @template: template/image-upload-grid-item.html
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "push-image-data",
						function onPushImageData( namespace, imageData ){
							if( self.scope.namespace == namespace ){
								var imageList = _.clone( self.state.imageList );

								imageList.push( imageData );

								self.setState( {
									"imageList": imageList
								} );
							}
						} );

					this.scope.on( "clear-image-upload-grid-data",
						function onClearImageUploadGridData( namespace ){
							if( self.scope.namespace == namespace ){
								self.setState( {
									"imageList": [ ]
								} );
							}
						} );

					this.scope.on( "set-processed-image",
						function onSetProcessedImage( namespace, rawImage ){
							if( self.scope.namespace == namespace ){
								var hashObject = new jsSHA( rawImage, "TEXT" );
								var hash = hashObject.getHash( "SHA-512", "HEX" );
								var imageReference = hash.substring( 0, 5 );

								var processedImageList = _.clone( self.state.processedImageList );

								processedImageList.push( imageReference );

								self.setState( {
									"processedImageList": processedImageList
								} );
							}
						} );

					this.scope.on( "set-pending-image",
						function onSetPendingImage( namespace, rawImage ){
							if( self.scope.namespace == namespace ){
								var hashObject = new jsSHA( rawImage, "TEXT" );
								var hash = hashObject.getHash( "SHA-512", "HEX" );
								var imageReference = hash.substring( 0, 5 );

								var pendingImageList = _.clone( self.state.pendingImageList );

								pendingImageList.push( imageReference );

								self.setState( {
									"pendingImageList": pendingImageList
								} );
							}
						} );

					this.scope.on( "set-failed-image",
						function onSetFailedImage( namespace, rawImage ){
							if( self.scope.namespace == namespace ){
								var hashObject = new jsSHA( rawImage, "TEXT" );
								var hash = hashObject.getHash( "SHA-512", "HEX" );
								var imageReference = hash.substring( 0, 5 );

								var failedImageList = _.clone( self.state.failedImageList );

								failedImageList.push( imageReference );

								self.setState( {
									"failedImageList": failedImageList
								} );
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var imageList = this.state.imageList;

					return; //: @template: template/image-upload-grid.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){

				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "image-upload-grid-rendered" );
				}
			} );

			return ImageUploadGrid;
		}
	] )

	.factory( "attachImageUploadGrid", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageUploadGrid",
		function factory(
			$rootScope,
			Event,
			PageFlow, 
			ImageUploadGrid
		){
			var attachImageUploadGrid = function attachImageUploadGrid( optionSet ){
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

				var pageFlow = PageFlow( scope, element, "image-upload-grid overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-image-upload-grid",
					function onShowImageUploadGrid( namespace ){
						if( scope.namespace == namespace ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-image-upload-grid",
					function onHideImageUploadGrid( namespace ){
						if( scope.namespace == namespace ){
							scope.hidePage( );
						}
					} );

				scope.publish( "hide-image-upload-grid" );

				ImageUploadGrid.attach( scope, element );
			};

			return attachImageUploadGrid;
		} 
	] )

	.directive( "imageUploadGrid", [
		"attachImageUploadGrid",
		function directive( attachImageUploadGrid ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachImageUploadGrid( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "image-upload-grid"
					} );
				}
			};
		}
	] );