angular.module( "Dashbar", [ "PageFlow", "Event", "Icon", "Profile", "ProfileSetting" ] )

	.factory( "Dashbar", [
		"Icon",
		"attachProfile",
		"attachProfileSetting",
		function factory( Icon, attachProfile, attachProfileSetting ){
			var Dashbar = React.createClass( {
				"statics": {
					"dashList": [ ],

					"dashItemIconSet": { },

					"hiddenDashItemList": [ ],

					"disabledDashItemList": [ ],

					"configure": function configure( dashbarConfiguration ){
						//: Don't be annoyed by this. I made this explicit so that I know what I'm doing here.
						this.dashList = dashbarConfiguration.dashList;

						this.dashItemIconSet = dashbarConfiguration.dashItemIconSet;

						this.hiddenDashItemList = dashbarConfiguration.hiddenDashItemList;

						this.disabledDashItemList = dashbarConfiguration.disabledDashItemList;

						return this;
					},

					"attach": function attach( scope, container ){
						var dashbarComponent = <Dashbar scope={ scope } 

							dashList={ this.dashList }

							dashItemIconSet={ this.dashItemIconSet }

							hiddenDashItemList={ this.hiddenDashItemList }

							disabledDashItemList={ this.disabledDashItemList }/>

						React.render( dashbarComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"dashList": null,
						"dashItemIconSet": null,
						"hiddenDashItemList": null,
						"disabledDashItemList": null,
						"dashbarState": "dashbar-main-view",
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
					var clickedDashItem = $( event.currentTarget ).attr( "value" );

					var eventNamespace = [ "dash-clicked", clickedDashItem ].join( ":" );

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

					var hashedValue = btoa( JSON.stringify( dashItem ) );

					var key = [ hashedValue, index ].join( ":" );

					var dashItemName = dashItem.name;

					var dashItemTitle = dashItem.title;

					var dashItemIcon = this.getDashItemIconSet( )[ dashItemName ]; 

					var disabledDashItemList = this.getDisabledDashItemList( );

					var hiddenDashItemList = this.getHiddenDashItemList( );

					var isDisabled = _.contains( disabledDashItemList, dashItemName );

					var isHidden = _.contains( hiddenDashItemList, dashItemName );

					return; //: @template: template/dash-item.html
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

					this.scope.on( "show-dashbar-sub-view",
						function onShowDashbarSubView( ){
							self.setState( {
								"dashbarState": "dashbar-sub-view"
							} );
						} );

					this.scope.on( "show-dashbar-main-view",
						function onShowDashbarMainView( ){
							self.setState( {
								"dashbarState": "dashbar-main-view"
							} );
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
					var dashbarState = this.state.dashbarState; 

					var componentState = this.state.componentState;

					var dashList = this.getDashList( );

					return; //: @template: template/dashbar.html
				},

				"componentDidMount": function componentDidMount( ){
					attachProfile( {
						"scope": this.scope,
						"element": $( ".dashbar-profile", this.getDOMNode( ) )
					} );

					attachProfileSetting( {
						"scope": this.scope,
						"element": $( ".dashbar-profile-setting", this.getDOMNode( ) )
					} );

					this.scope.broadcast( "dashbar-rendered" );	
				}
			} );

			return Dashbar;
		}
	] )

	.factory( "attachDashbar", [
		"$rootScope",
		"PageFlow",
		"Event",
		"Dashbar",
		function factory( $rootScope, PageFlow, Event, Dashbar ){
			var attachDashbar = function attachDashbar( optionSet ){
				var scope = optionSet.scope || $rootScope;

				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				Event( scope );

				PageFlow( scope, element, "dashbar overflow" );

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

				Dashbar
					.configure( scope )
					.attach( scope, element );
			};

			return attachDashbar;
		}
	] )

	.directive( "dashbar", [
		"attachDashbar",
		function directive( attachDashbar ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					attachDashbar( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet
					} );
				}
			};
		}
	] );
