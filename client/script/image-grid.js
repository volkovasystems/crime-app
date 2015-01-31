angular

	.module( "ImageGrid", [ "Event", "PageFlow" ] )
	
	.factory( "ImageGrid", [
		function factory( ){
			var ImageGrid = React.createClass( {
				"statics": {
					"attach": function attach( scope, container, optionSet ){
						var imageGridComponent = (
							<ImageGrid
								scope={ scope }
								imageList={ optionSet.imageList } />
						);

						React.render( imageGridComponent, container[ 0 ] );

						return this;
					}
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"imageList": [ ]
					};
				},

				"getImageGridLayout": function getImageGridLayout( imageCount ){
					var layoutList = [ ];

					switch( imageCount ){
						case 1:
							layoutList = [ 1 ];
							break;

						case 2:
							layoutList = [ 1, 1 ];
							break;

						case 3:
							layoutList = [ 1, 2 ];
							break;

						case 4:
							layoutList = [ 2, 2 ];
							break;

						case 5:
							layoutList = [ 1, 2, 2 ];
							break;

						case 6:
							layoutList = [ 1, 2, 3 ];
							break;

						default:
							var reducer = 3;
							do{
								if( imageCount && imageCount >= reducer ){
									layoutList.push( reducer );

									imageCount -= reducer;

								}else{
									reducer--;
								}

							}while( imageCount && reducer );		
					}

					var imageGridLayout = layoutList.join( "" );

					return imageGridLayout;
				},

				"onClickImageItem": function onClickImageItem( event ){
					
				},

				"onEachImageItem": function onEachImageItem( imageData, index, imageList ){
					var imageFullSource = imageData.imageFullSource;

					var hashObject = new jsSHA( imageFullSource, "TEXT" );
					var hash = hashObject.getHash( "SHA-512", "HEX" );
					var key = hash;

					var imageReference = hash.substring( 0, 5 );

					if( imageList.length == ( index + 1 ) ){
						var self = this;

						var timeout = setTimeout( function onTimeout( ){
							$( self.getDOMNode( ) ).photosetGrid( );

							$( self.getDOMNode( ) ).mCustomScrollbar( {
								"theme": "minimal-dark",
								"setHeight": 300
							} );

							clearTimeout( timeout );
						}, 0 );
					}

					return; //: @template: template/image-grid-item.html
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){
				},

				"render": function onRender( ){
					var imageList = this.props.imageList;

					var imageGridLayout = this.getImageGridLayout( imageList.length );

					return; //: @template: template/image-grid.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){

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

				ImageGrid.attach( scope, element, {
					"imageList": optionSet.imageList
				} );
			};

			return attachImageGrid;
		} 
	] )

	.directive( "imageGrid", [
		"attachImageGrid",
		function directive( attachImageGrid ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachImageGrid( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "image-grid"
					} );
				}
			};
		}
	] );