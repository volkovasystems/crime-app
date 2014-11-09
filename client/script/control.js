angular.module( "Control", [ "Event", "PageFlow", "Icon" ] )
	.factory( "Control", [
		"Icon",
		function factory( Icon ){
			var Control = React.createClass( {
				"statics": {
					"controlList": [ ],
					
					"hiddenControlList": [ ],
					
					"disabledControlList": [ ],

					"configure": function configure( controlConfiguration ){
						this.controlList = controlConfiguration.controlList;

						this.hiddenControlList = controlConfiguration.hiddenControlList;

						this.disabledControlList = controlConfiguration.disabledControlList;

						return this;
					},

					"attach": function attach( scope, container ){
						var controlComponent = <Control 
							
							scope={ scope } 

							controlList={ this.controlList }
							
							hiddenControlList={ this.hiddenControlList }
							
							disabledControlList={ this.disabledControlList } />;

						React.render( controlComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"controlList": null,
						"hiddenControlList": null,
						"disabledControlList": null,
						"componentState": "control-normal"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"controlList": this.controlList,
						"hiddenControlList": this.hiddenControlList,
						"disabledControlList": this.disabledControlList
					};
				},

				/*:
					The purpose of this is based on the main concept of control component.

					Controls are volatile per feature. (Like the OSX's menu)

					Feature function should be held in each feature modules.

					Feature function will be invoked by the controls.

					Feature functions will be invoked by names.

					Feature modules should configure the control component.

					Therefore we need to clear the control list whenever a feature will be activated.
				*/
				"clearControlList": function clearControlList( ){
					this.setState( {
						"controlList": [ ],
						"hiddenControlList": [ ],
						"disabledControlList": [ ]
					} );
				},

				"getControlList": function getControlList( ){
					return this.state.controlList || this.props.controlList;
				},

				"getHiddenControlList": function getHiddenControlList( ){
					return this.state.hiddenControlList || this.props.hiddenControlList;
				},

				"getDisabledControlList": function getDisabledControlList( ){
					return this.state.disabledControlList || this.props.disabledControlList;
				},

				"onClickControlItem": function onClickControlItem( event ){
					var controlName = $( event.currentTarget ).attr( "value" );

					var eventNamespace = [ "control-click", controlName ].join( ":" ); 

					this.scope.publish( eventNamespace );
				},

				"onEachControlItem": function onEachControlItem( controlData ){
					var componentState = this.state.componentState;

					var hiddenControlList = this.getHiddenControlList( );

					var disabledControlList = this.getDisabledControlList( );

					var name = controlData.name;

					var title = controlData.title || "";

					var icon = controlData.icon;

					var iconSource = controlData.iconSource;

					var isDescriptive = !_.isEmpty( title );

					var isIconic = !isDescriptive || !_.isEmpty( icon ); 

					var isHidden = _.contains( hiddenControlList, name );

					var isDisabled = _.contains( disabledControlList, name );

					return (
						<div
							className={ [
								"control-item",
								"inline-block",
								( isHidden )? "hidden" : "shown",
								( isDisabled )? "disabled" : "enabled",
								( isIconic )? "iconic" : "",
								( isDescriptive )? "descriptive" : "",
								componentState
							].join( " " ) }
							onClick={ this.onClickControlItem }
							value={ name }>

							<div
								className={ [
									"control-icon",
									"inline-block",
									( isIconic )? "shown" : "hidden",
								].join( " " ) }>
								<Icon 
									name={ icon }
									src={ iconSource } />
							</div>

							<div
								className={ [
									"control-title",
									"inline-block",
									( isDescriptive )? "shown" : "hidden"
								].join( " " ) }>
								<span>
									{ title.toUpperCase( ) }
								</span>
							</div>

						</div>
					);
				},

				"onEachControlGroup": function onEachControlGroup( controlData ){
					var componentState = this.state.componentState;

					var controlList = controlData.controlList;

					return (
						<div
							className={ [
								"control-group",
								componentState
							].join( " " ) }>
							{ controlList.map( this.onEachControlItem ) }
						</div>
					);
				},

				"onEachControl": function onEachControl( controlData ){
					if( "controlList" in controlData ){
						return this.onEachControlGroup( controlData );
					}
					
					return this.onEachControlItem( controlData );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-control-list",
						function onSetControlList( controlList, isAppend ){
							var timeout = setTimeout( function onTimeout( ){
								if( isAppend ){
									controlList = self.getControlList( ).concat( controlList );
								}

								self.setState( {
									"controlList": controlList
								} );

								clearTimeout( timeout );
							}, 100 );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"render": function render( ){
					var self = this;
					
					var controlList = this.getControlList( );
					
					return (
						<div
							className={ [
								"control-container"
							].join( " " ) }>
							<div
								className={ [
									"control-component"
								].join( " " ) }>
								{ controlList.map( this.onEachControl ) }
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( !_.isEqual( prevState.controlList, this.state.controlList ) ){
						this.scope.publish( "control-list-changed" );
					}
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.publish( "control-rendered" );
				}
			} );

			return Control;
		}
	] )
	.directive( "control", [
		"PageFlow",
		"Event",
		"Control",
		function directive( PageFlow, Event, Control ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					Event( scope );

					PageFlow( scope, element, "control" );					

					scope.on( "show-control",
						function onShowControl( ){
							scope.showPage( );
						} );

					scope.on( "hide-control",
						function onHideControl( ){
							scope.hidePage( );
						} );

					scope.publish( "hide-control" );

					Control
						.configure( scope )
						.attach( scope, element );
				}
			};
		}
	] );