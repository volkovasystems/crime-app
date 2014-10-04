Crime.directive( "crimeNotify", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeNotify = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"notifyTitle": "",
					"notifyMessage": "",
					"notifyType": "default"
				};
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;

				this.props.scope.$on( "notify-header",
					function onNotifyHeader( event, notifyTitle, notifyMessage, notifyType ){
						self.setState( {
							"notifyTitle": notifyTitle,
							"notifyMessage": notifyMessage,
							"notifyType": notifyType
						} );
					} );

				this.props.scope.$on( "notify-footer",
					function onNotifyFooter( event, notifyTitle, notifyMessage, notifyType ){
						self.setState( {
							"notifyTitle": notifyTitle,
							"notifyMessage": notifyMessage,
							"notifyType": notifyType
						} );
					} );

				this.props.scope.$on( "notify-center",
					function onNotifyCenter( event, notifyTitle, notifyMessage, notifyType ){
						self.setState( {
							"notifyTitle": notifyTitle,
							"notifyMessage": notifyMessage,
							"notifyType": notifyType
						} );
					} );

				this.props.scope.$on( "notify-whole",
					function onNotifyWhole( event, notifyTitle, notifyMessage, notifyType  ){
						self.setState( {
							"notifyTitle": notifyTitle,
							"notifyMessage": notifyMessage,
							"notifyType": notifyType
						} );
					} );

				this.props.scope.$on( "notify-off",
					function onNotifyOff( event, notifyTitle, notifyMessage, notifyType ){
						self.setState( {
							"notifyTitle": notifyTitle,
							"notifyMessage": notifyMessage,
							"notifyType": notifyType
						} );
					} );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-notify-container">
						<div 
							className={ [
								"alert",
								( this.state.notifyType == "success" )? "alert-success": "",
								( this.state.notifyType == "default" )? "alert-info": "",
								_.isEmpty( this.state.notifyType )? "alert-info": "",
								( this.state.notifyType == "warn" )? "alert-warning": "",
								( this.state.notifyType == "error" )? "alert-danger": "",
								"alert-dismissible"
							].join( " " ) } 
							role="alert">

							<button 
								type="button" 
								className="close"
								onClick={ this.onClick }>
								
								<span aria-hidden="true">{ '\u00d7' }</span>
								<span className="sr-only">Close</span>
							</button>

							<strong>{ this.state.notifyTitle.toUpperCase( ) }</strong>
							<span>{ this.state.notifyMessage.toUpperCase( ) }</span>
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-notify-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageUp( );

				scope.$on( "notify-header",
					function onNotifyHeader( ){
						scope.clearFlow( );
						scope.applyFlow( "notify-header", "notify-compact" );
					} );

				scope.$on( "notify-footer",
					function onNotifyFooter( ){
						scope.clearFlow( );
						scope.applyFlow( "notify-footer", "notify-compact" );
					} );

				scope.$on( "notify-center",
					function onNotifyCenter( ){
						sscope.clearFlow( );
						scope.applyFlow( "notify-center", "notify-compact" );
					} );

				scope.$on( "notify-whole",
					function onNotifyWhole( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "notify-off",
					function onNotifyOff( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeNotify scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );