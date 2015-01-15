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
						"imageGridLayout": ""
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

				"onEachImageItem": function onEachImageItem( imageData ){
					var imageDisplaySource = imageData.imageDisplaySource;

					var imageFullSource = imageData.imageFullSource;

					var width = $( this.getDOMNode( ) ).width( ) / 3;

					width = width - 20;

					width = [ width, "px" ].join( "" );

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