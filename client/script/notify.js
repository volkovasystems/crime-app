angular.module( "Notify", [ "Event", "PageFlow" ] )

	.constant( "INFO_TYPE", "info-type" )

	.constant( "WARN_TYPE", "warn-type" )

	.constant( "ERROR_TYPE", "error-type" )

	.constant( "SUCCESS_TYPE", "success-type" )

	.factory( "Notify", [
		"INFO_TYPE",
		"WARN_TYPE",
		"ERROR_TYPE",
		"SUCCESS_TYPE",
		function factory(
			INFO_TYPE,
			WARN_TYPE,
			ERROR_TYPE,
			SUCCESS_TYPE
		){
			var Notify = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Notify scope={ scope } />, container[ 0 ] );

						return this;
					},

					"parseType": function parseType( type ){
						if( ( /info/i ).test( type ) ){
							return INFO_TYPE;
						}

						if( ( /warn/i ).test( type ) ){
							return WARN_TYPE;
						}

						if( ( /error/i ).test( type ) ){
							return ERROR_TYPE;
						}

						if( ( /success/i ).test( type ) ){
							return SUCCESS_TYPE;
						}
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"notifyMessage": "",
						"notifyType": INFO_TYPE
					};
				},

				"onClickCloseNotify": function onClickCloseNotify( ){
					this.scope.publish( "hide-notify" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "notify",
						function onNotify( message, type ){
							self.setState( {
								"notifyMessage": message,
								"notifyType": Notify.parseType( type )
							} );

							self.scope.publish( "show-notify" );

							self.timeout = setTimeout( function onTimeout( ){
								$( self.refs.notifyComponent.getDOMNode( ) ).fadeOut( "slow", 
									function onFadeOut( ){
										self.scope.publish( "hide-notify" );

										clearTimeout( self.timeout );

										self.timeout = null;
									} );
							}, 3000 );
						} );

					this.scope.on( "hide-notify",
						function onHideNotify( ){
							if( self.timeout ){
								clearTimeout( self.timeout );

								self.timeout = null;
							}
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var notifyMessage = this.state.notifyMessage;

					var notifyType = this.state.notifyType;

					return; //: @template: template/notify.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "notify-rendered" );	
				}
			} );

			return Notify;
		}
	] )

	.directive( "notify", [
		"Event",
		"PageFlow",
		"Notify",
		function directive( Event, PageFlow, Notify ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "notify" );

					scope.on( "show-notify",
						function onShowNotify( ){
							scope.showPage( );
						} );

					scope.on( "hide-notify",
						function onHideNotify( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-notify" );

					Notify
						.attach( scope, element );
				}
			};
		}
	] );