angular.module( "Notify", [ "Icon", "Event", "PageFlow" ] )

	.constant( "INFO_TYPE", "info-type" )

	.constant( "WARN_TYPE", "warn-type" )

	.constant( "ERROR_TYPE", "error-type" )

	.constant( "SUCCESS_TYPE", "success-type" )

	.factory( "Notify", [
		"Icon",
		"INFO_TYPE",
		"WARN_TYPE",
		"ERROR_TYPE",
		"SUCCESS_TYPE",
		function factory(
			Icon,
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
						"notifyTitle": "",
						"notifyMessage": "",
						"notifyType": INFO_TYPE,
						"notifyState": "notify-passive",
						"componentState": "notify-footer"
					};
				},

				"onClickCloseNotifyButton": function onClickCloseNotifyButton( ){
					this.scope.publish( "hide-notify" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-notify-header",
						function onSetNotifyHeader( ){
							self.setState( {
								"componentState": "notify-header"
							} );
						} );

					this.scope.on( "set-notify-footer",
						function onSetNotifyFooter( ){
							self.setState( {
								"componentState": "notify-footer"
							} );
						} );

					this.scope.on( "notify",
						function onNotify( title, message, type, controlSet ){
							self.setState( {
								"notifyTitle": title,
								"notifyMessage": message,
								"notifyType": Notify.parseType( type )
							} );

							self.scope.broadcast( "show-notify" );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var notifyState = this.state.notifyState;

					var componentState = this.state.componentState;

					var notifyTitle = this.state.notifyTitle;

					var notifyMessage = this.state.notifyMessage;

					var notifyType = this.state.notifyType;

					return ( 
						<div 
							className={ [
								"notify-container",
								notifyState,
								componentState
							].join( " " ) }>
							
							<div
								className={ [
									"notify-component",
									notifyState,
									componentState
								].join( " " ) }>

								<div
									className={ [
										"notify-header",
										"shown"
									].join( " " ) }>

									<div
										className={ [
											"notify-icon-container"
										].join( " " ) }>
										<Icon
											className={ [
												"notify-icon",
												notifyType
											].join( " " ) }
											name="ic_info_24px" />
									</div>
									
									<div
										className={ [
											"notify-title"
										].join( " " ) }>
										<span>
											{ notifyTitle.toUpperCase( ) }
										</span>
									</div>

									<div
										className={ [
											"close-notify-button"
										].join( " " ) }
										onClick={ this.onClickCloseNotifyButton }>
										<Icon
											className={ [
												"close-notify-icon"
											].join( " " ) }
											name="ic_close_24px" />
									</div>
								</div>

								<div
									className={ [
										"notify-body",
										"shown"
									].join( " " ) }>

									<div
										className={ [
											"notify-message"
										].join( " " ) }>
										<p>
											{ notifyMessage.toUpperCase( ) }
										</p>
									</div>

								</div>

								<div
									className={ [
										"notify-footer"
									].join( " " ) }>
								</div>

							</div>
						</div>
					);
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

					scope.on( "reset-notify",
						function onResetNotify( ){
							scope.toggleFlow( "!notify-footer", "!notify-header" );
						} );

					scope.on( "set-notify-header",
						function onSetNotifyHeader( ){
							scope.toggleFlow( "!notify-footer", "notify-header" );
						} );

					scope.on( "set-notify-footer",
						function onSetNotifyHeader( ){
							scope.toggleFlow( "!notify-header", "notify-footer" );
						} );

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