angular

	.module( "ImageSwipe", [ "Event", "PageFlow" ] )

	.factory( "ImageSwipe", [
		function factory( ){
			var ImageSwipe = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageSwipeComponent = (
							<ImageSwipe 
								scope={ scope } />
						);

						React.render( imageSwipeComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
					};
				},

				"onClickCloseImageSwipe": function onClickCloseImageSwipe( event ){
					
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"componentWillUpdate": function componentWillUpdate( ){

				},

				"render": function onRender( ){
					

					return; //: @template: template/image-swipe.html
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "image-swipe-rendered" );
				}
			} );

			return ImageSwipe;
		}
	] )

	.factory( "attachImageSwipe", [
		"$rootScope",
		"Event",
		"PageFlow",
		"ImageSwipe",
		function factory(
			$rootScope,
			Event,
			PageFlow, 
			ImageSwipe
		){
			var attachImageSwipe = function attachImageSwipe( optionSet ){
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

				var pageFlow = PageFlow( scope, element, "image-swipe overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-image-swipe",
					function onShowImageSwipe( ){
						scope.showPage( );
					} );

				scope.on( "hide-image-swipe",
					function onHideImageSwipe( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-image-swipe" );

				ImageSwipe.attach( scope, element );
			};

			return attachImageSwipe;
		} 
	] )

	.directive( "imageSwipe", [
		"attachImageSwipe",
		function directive( attachImageSwipe ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachImageSwipe( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed",
						"namespace": "image-swipe"
					} );
				}
			};
		}
	] );