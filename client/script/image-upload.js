angular
	
	.module( "ImageUpload", [ "Event", "PageFlow" ] )
	
	.constant( "IMAGE_UPLOAD_HEADER_TITLE", labelData.IMAGE_UPLOAD_HEADER_TITLE )

	.factory( "ImageUpload", [
		"IMAGE_UPLOAD_HEADER_TITLE",
		function factory( 
			IMAGE_UPLOAD_HEADER_TITLE
		){
			var ImageUpload = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var imageUploadComponent = (
							<ImageUpload 
								scope={ scope } />
						);

						React.render( imageUploadComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
					};
				},

				"onClickCloseImageUpload": function onClickCloseImageUpload( event ){
					
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
					

					return; //: @template: template/image-upload.html
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