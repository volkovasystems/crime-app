angular

	.module( "ImageGrid", [ "Event", "PageFlow" ] )
	
	.factory( "ImageGrid", [
		function factory( ){
			var ImageGrid = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageGridComponent = (
							<ImageGrid
								scope={ scope } />
						);

						React.render( imageGridComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"imageList": [ ],
						"imageGridLayout": "",
						"selectedImageList": [ ],
						"processedImageList": [ ],
						"failedImageList": [ ],
						"pendingImageList": [ ]
					};
				},

				"updateImageGridLayout": function updateImageGridLayout( ){
					var imageCount = this.state.imageList.length;

					var countFactor = Math.floor( imageCount / 3 );

					var remainingFactor = imageCount % 3;

					if( remainingFactor != 0 ){
						countFactor += 1;
					}

					var imageGridLayout = ( new Array( countFactor + 1 ) ).join( "3" );

					var self = this;

					this.setState( {
						"imageGridLayout": imageGridLayout
					} );
				},

				"onClickCloseImageGrid": function onClickCloseImageGrid( event ){
					
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

					var imageFullSource = imageData.imageFullSource;

					var hashObject = new jsSHA( imageFullSource, "TEXT" );
					var hash = hashObject.getHash( "SHA-512", "HEX" );
					var key = hash;

					var imageReference = hash.substring( 0, 5 );

					var isSelected = _.contains( selectedImageList, imageReference );

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

					return; //: @template: template/image-grid-item.html
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

					this.scope.on( "clear-image-grid-data",
						function onClearImageGridData( namespace ){
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
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){
					/*if( !_.isEqual( nextState.imageList, this.state.imageList ) ){
						$( ".image-grid-component", this.getDOMNode( ) ).removeData( );
						
						$( "img", this.getDOMNode( ) ).removeData( );

						$( "img", this.getDOMNode( ) ).detach( )
							.appendTo( $( ".image-grid-component", this.getDOMNode( ) ) );

						$( ".photoset-row", this.getDOMNode( ) ).remove( );
					}*/
				},

				"render": function onRender( ){
					var imageList = this.state.imageList;

					var imageGridLayout = this.state.imageGridLayout;

					return; //: @template: template/image-grid.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					/*if( !_.isEqual( prevState.imageList, this.state.imageList ) ){
						this.updateImageGridLayout( );

						$( ".image-grid-component", this.getDOMNode( ) )
							.photosetGrid( {
								"layout": this.state.imageGridLayout,
								"width": [ $( this.getDOMNode( ) ).width( ) / 3, "px" ].join( "" )
							} );
					}*/
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "image-grid-rendered" );
				}
			} );

			return ImageGrid;
		}
	] )

	.factory( "attachImageGrid", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageGrid",
		function factory(
			$rootScope,
			Event,
			PageFlow, 
			ImageGrid
		){
			var attachImageGrid = function attachImageGrid( optionSet ){
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

				var pageFlow = PageFlow( scope, element, "image-grid overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-image-grid",
					function onShowImageGrid( namespace ){
						if( scope.namespace == namespace ){
							scope.showPage( );	
						}
					} );

				scope.on( "hide-image-grid",
					function onHideImageGrid( namespace ){
						if( scope.namespace == namespace ){
							scope.hidePage( );
						}
					} );

				scope.publish( "hide-image-grid" );

				ImageGrid.attach( scope, element );
			};

			return attachImageGrid;
		} 
	] )

	.directive( "imageGrid", [
		"attachImageGrid",
		function directive( attachImageGrid ){
			attachImageGrid( {
				"scope": scope,
				"element": element,
				"attributeSet": attributeSet,
				"embedState": "no-embed",
				"namespace": "image-grid"
			} );
		}
	] );