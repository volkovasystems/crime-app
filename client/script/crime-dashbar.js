Crime.directive( "crimeDashbar", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeDashbar = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"dashList": [ 
						"home",
						"report",
						"update",
						"statistic",
						"data",
						"locate",
						"profile",
						"setting",
						"about us"
					],
					"dashItemIconSet": {
						"home": "entypo home",
						"report": "entypo flash",
						"update": "entypo megaphone",
						"statistic": "entypo pie-chart",
						"data": "entypo database",
						"setting": "entypo cog",
						"locate": "entypo compass",
						"profile": "entypo user",
						"about us": "entypo heart-empty"
					},
					"hiddenDashItemList": [
						"report",
						"update",
						"statistic",
						"data",
						"locate",
						"profile",
						"setting"
					],
					"disabledDashItemList": [ ],
					"componentState": "dashbar-minified"
				};
			},

			"onDashbarItemClick": function onDashbarItemClick( event ){

			},

			"onMinifiedButtonClick": function onMinifiedButtonClick( event ){
				this.props.scope.$root.$broadcast( "show-listed-dashbar" );
			},

			"onDashbarHeaderItemClick": function onDashbarHeaderItemClick( event ){
				this.props.scope.$root.$broadcast( "show-minified-dashbar" );
			},

			"onEachDashItem": function onEachDashItem( dashItem, index ){
				var componentState = this.state.componentState;

				var key = [ dashItem, index ].join( ":" );

				var dashItemIcon = this.state.dashItemIconSet[ dashItem ]; 

				var disabledDashItemList = this.state.disabledDashItemList;
				var hiddenDashItemList = this.state.hiddenDashItemList;

				return (
					<div 
						key={ key }
						className={
							[
								"dash-item",
								"row",
								componentState,
								( _.contains( disabledDashItemList, dashItem ) )? "disabled" : "",
								( _.contains( hiddenDashItemList, dashItem ) )? "hidden" : "shown"
							].join( " " )
						}
						onClick={ this.onDashbarItemClick } 
						value={ dashItem }>
						<a 
							className={ [
								"action-element"
							].join( " " ) }
							href={ [
								"#",
								dashItem
							].join( "/" ) }>
							<span 
								className={ [
									"text-center",
									dashItemIcon
								].join( " " ) }>
							</span>

							<span>
								{ dashItem.toUpperCase( ) }
							</span>
						</a>
					</div>
				);
			},

			"setComponentState": function setComponentState( componentState ){
				this.setState( {
					"componentState": componentState
				} );
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				var self = this;

				this.props.scope.$on( "show-minified-dashbar",
					function onShowMinifiedDashbar( ){
						self.setComponentState( "dashbar-minified" );
					} );

				this.props.scope.$on( "show-iconified-dashbar",
					function onShowIconifiedDashbar( ){
						self.setComponentState( "dashbar-iconified" );
					} );

				this.props.scope.$on( "show-listed-dashbar",
					function onShowListedDashbar( ){
						self.setComponentState( "dashbar-listed" );
					} );

				this.props.scope.$on( "logged-in",
					function onLoggedIn( ){
						self.setState( {
							"hiddenDashItemList": [
								"report",
								"update",
								"statistic",
								"data"
							]
						} );
					} );
			},

			"componentWillMount": function componentWillMount( ){
				this.attachAllComponentEventListener( );
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				return (
					<div 
						className={ [
							"crime-dashbar-container",
							componentState
						].join( " " ) }>

						<div 
							className={ [
								"dashbar-minified-button",
								"text-center",
								componentState
							].join( " " ) }
							onClick={ this.onMinifiedButtonClick }>
							<a 
								className={ [
									"action-element"
								].join( " " ) }
								href={ [
									"#",
									"open-dashbar"
								].join( "/" ) }>
								
								<span 
									className={ [
										"dashbar-minified-icon",
										"entypo",
										"list"
									].join( " " ) }>
								</span>
							</a>
						</div>

						<div 
							className={ [
								"dash-header-item",
								"dash-item",
								"row",
								componentState
							].join( " " ) }
							onClick={ this.onDashbarHeaderItemClick }>
							<a 
								className={ [
									"action-element"
								].join( " " ) }
								href={ [
									"#",
									"close-dashbar"
								].join( "/" ) }>
								<span 
									className={ [
										"text-center",
										"entypo",
										"chevron-thin-left"
									].join( " " ) }>
								</span>
								<span>
									BACK
								</span>
							</a>
						</div>

						<div 
							className={ [
								"dash-list",
								componentState
							].join( " " ) }>
							{ this.state.dashList.map( this.onEachDashItem ) }
						</div>

					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-dashbar-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "dashbar" );

				scope.reflow( "hidden", "dashbar-minified" );

				scope.$on( "show-minified-dashbar",
					function onShowMinifiedDashbar( ){
						scope.reflow( "shown", "dashbar-minified" );
					} );

				scope.$on( "show-iconified-dashbar",
					function onShowIconifiedDashbar( ){
						scope.reflow( "shown", "dashbar-iconified" );
					} );

				scope.$on( "show-listed-dashbar",
					function onShowListedDashbar( ){
						scope.reflow( "shown", "dashbar-listed" );
					} );

				scope.$on( "show-default-page",
					function onShowDefaultPage( ){
						scope.$root.$broadcast( "show-minified-dashbar" );
					} );

				scope.$on( "show-dashbar",
					function onShowMap( ){
						scope.applyFlow( "shown" );
					} );

				scope.$on( "hide-dashbar",
					function onHideMap( ){
						scope.applyFlow( "hidden" );
					} );

				React.renderComponent( <crimeDashbar scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );
