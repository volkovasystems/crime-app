angular.module( "Dashbar", [ "PageFlow", "Event" ] )
	.directive( "dashbar", [
		"PageFlow",
		"Event",
		function directive( PageFlow, Event ){
			var dashbar = React.createClass( {
				"statics": {
					"configure": function configure( dashbarConfiguration ){
						dashbar.dashList = dashbarConfiguration.dashList;

						dashbar.dashItemIconSet = dashbarConfiguration.dashItemIconSet;

						dashbar.hiddenDashItemList = dashbarConfiguration.hiddenDashItemList;

						dashbar.disabledDashItemList = dashbarConfiguration.disabledDashItemList;

						return dashbar;
					},

					"attach": function attach( scope, container ){
						var dashbarComponent = <dashbar scope={ scope } 

							dashList={ dashbar.dashList }

							dashItemIconSet={ dashbar.dashItemIconSet }

							hiddenDashItemList={ dashbar.hiddenDashItemList }

							disabledDashItemList={ dashbar.disabledDashItemList }/>

						React.renderComponent( dashbarComponent, container[ 0 ] );

						return dashbar;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"dashList": null,
						"dashItemIconSet": null,
						"hiddenDashItemList": null,
						"disabledDashItemList": null,
						"componentState": "dashbar-minified"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"dashList": [ ],
						"dashItemIconSet": { },
						"hiddenDashItemList": [ ],
						"disabledDashItemList": [ ]
					};
				},

				"getDashList": function getDashList( ){
					return this.state.dashList || this.props.dashList;
				},

				"getDashItemIconSet": function getDashItemIconSet( ){
					return this.state.dashItemIconSet || this.props.dashItemIconSet;
				},

				"getHiddenDashItemList": function getHiddenDashItemList( ){
					return this.state.hiddenDashItemList || this.props.hiddenDashItemList;
				},

				"getDisabledDashItemList": function getDisabledDashItemList( ){
					return this.state.disabledDashItemList || this.props.disabledDashItemList;
				},

				"onDashbarItemClick": function onDashbarItemClick( event ){
					var clickedDashItem = event.currentTarget.props.value;

					var eventNamespace = [ "clicked", clickedDashItem ].join( ":" );

					this.scope.publish( eventNamespace );
				},

				"onMinifiedButtonClick": function onMinifiedButtonClick( event ){
					this.scope.broadcast( "show-listed-dashbar" );
				},

				"onDashbarHeaderItemClick": function onDashbarHeaderItemClick( event ){
					this.scope.broadcast( "show-minified-dashbar" );
				},

				"onEachDashItem": function onEachDashItem( dashItem, index ){
					var componentState = this.state.componentState;

					var key = [ dashItem, index ].join( ":" );

					var dashItemIcon = this.getDashItemIconSet( )[ dashItem ]; 

					var disabledDashItemList = this.getDisabledDashItemList( );

					var hiddenDashItemList = this.getHiddenDashItemList( );

					var isDisabled = _.contains( disabledDashItemList, dashItem );

					var isHidden = _.contains( hiddenDashItemList, dashItem );

					return (
						<div 
							key={ key }
							className={
								[
									"dash-item",
									( isDisabled )? "disabled" : "",
									( isHidden )? "hidden" : "shown",
									componentState
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

								<div
									className={ [
										"dash-item-icon"
									].join( " " ) } >
									<icon name={ dashItemIcon } />
								</div>

								<div
									className={ [
										"dash-item-label"
									].join( " " ) }>
									<span>
										{ dashItem.toUpperCase( ) }
									</span>
								</div>
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

					this.scope.on( "show-minified-dashbar",
						function onShowMinifiedDashbar( ){
							self.setComponentState( "dashbar-minified" );
						} );

					this.scope.on( "show-iconified-dashbar",
						function onShowIconifiedDashbar( ){
							self.setComponentState( "dashbar-iconified" );
						} );

					this.scope.on( "show-listed-dashbar",
						function onShowListedDashbar( ){
							self.setComponentState( "dashbar-listed" );
						} );

					this.scope.on( "set-hidden-dash-item-list",
						function onSetHiddenDashItemList( hiddenDashItemList ){
							self.setState( {
								"hiddenDashItemList": hiddenDashItemList
							} );
						} );

					this.scope.on( "set-disabled-dash-item-list",
						function onSetDisabledDashItemList( disabledDashItemList ){
							self.setState( {
								"disabledDashItemList": disabledDashItemList
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function onRender( ){
					var componentState = this.state.componentState;

					var dashList = this.getDashList( );

					return (
						<div 
							className={ [
								"dashbar-container",
								componentState
							].join( " " ) }>

							<div 
								className={ [
									"dashbar-minified-button",
									"dash-item",
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
									
									<div
										className={ [ 
											"dash-item-icon" 
										].join( " " ) }>
										<icon 
											className={ [
												"dashbar-minified-icon"
											].join( " " ) } 
											name="ic_menu_24px" />
									</div>
								</a>
							</div>

							<div 
								className={ [
									"dash-header-item",
									"dash-item",
									"dashbar-close-button",
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

									<div
										className={ [ 
											"dash-item-icon" 
										].join( " " ) }>
										<icon 
											className={ [
												"dashbar-close-icon"
											].join( " " ) } 
											name="ic_close_24px" />
									</div>
									
									<div
										className={ [
											"dashbar-header-label",
											"dash-item-label"
										].join( " " ) }>
										<span>
											CLOSE
										</span>
									</div>
								</a>
							</div>

							<div
								className={ [
									"dash-list",
									componentState
								].join( " " ) }>
								{ dashList.map( this.onEachDashItem ) }
							</div>
						</div>
					);
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "dashbar-rendered" );	
				}
			} );

			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "dashbar" );

					scope.on( "show-default-page",
						function onShowDefaultPage( ){
							scope.broadcast( "show-minified-dashbar" );
						} );

					scope.on( "hide-default-page",
						function onHideDefaultPage( ){
							scope.broadcast( "hide-dashbar" );
						} );

					scope.on( "show-minified-dashbar",
						function onShowMinifiedDashbar( ){
							scope.reflow( "shown", "dashbar-minified" );
						} );

					scope.on( "show-iconified-dashbar",
						function onShowIconifiedDashbar( ){
							scope.reflow( "shown", "dashbar-iconified" );
						} );

					scope.on( "show-listed-dashbar",
						function onShowListedDashbar( ){
							scope.reflow( "shown", "dashbar-listed" );
						} );

					scope.on( "show-dashbar",
						function onShowDashbar( ){
							scope.showPage( );
						} );

					scope.on( "hide-dashbar",
						function onHideDashbar( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-dashbar" );

					dashbar
						.configure( scope )
						.attach( scope, element );
				}
			};
		}
	] );
