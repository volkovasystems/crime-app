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

				"removeControl": function removeControl( reference ){
					var controlList = this.state.controlList;

					controlList = _.first( controlList,
						function onEachControl( controlData ){
							return controlData.reference !== reference
						} );

					this.setState( {
						"controlList": controlList
					} );
				},

				"flattenControlList": function flattenControlList( controlList ){
					var flattenControlList = _( controlList )
						.map( function onEachControl( controlData ){
							return controlData.controlList || controlData;
						} )
						.flatten( );

					return flattenControlList;
				},

				"extractControlReferenceList": function extractControlReferenceList( controlList ){
					var controlReferenceList = _( this.flattenControlList( controlList ) )
						.map( function onEachControl( controlData ){
							return [ controlData.reference, controlData.name ].join( ":" );
						} );

					return controlReferenceList;
				},

				"checkIfControlListExist": function checkIfControlListExist( controlList ){
					return !_.isEmpty( 
						_.intersection( 
							this.extractControlReferenceList( controlList ),
							this.extractControlReferenceList( this.state.controlList ) 
						) 
					);
				},

				"setControlList": function setControlList( controlList, isAppend ){
					if( this.checkIfControlListExist( controlList ) ){
						return;
					}

					if( isAppend ){
						controlList = this.getControlList( ).concat( controlList );
					}

					this.setState( {
						"controlList": controlList
					} );
				},

				"getControlList": function getControlList( ){
					return this.state.controlList || this.props.controlList;
				},

				"setHiddenControlList": function setHiddenControlList( hiddenControlList ){
					var self = this;

					_.each( hiddenControlList,
						function onEachHiddenControl( hiddenControlName ){
							if( ( /^\!/ ).test( hiddenControlName ) ){
								hiddenControlName = hiddenControlName.replace( /^\!/, "" );
								
								self.setState( {
									"hiddenControlList": _.without( self.getHiddenControlList( ), hiddenControlName )
								} );
								
							}else{
								self.setState( {
									"hiddenControlList": self.getHiddenControlList( ).concat( [ hiddenControlName ] )
								} );
							}
						} );
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

				"onEachControlItem": function onEachControlItem( controlData, percentageWidth, index ){
					var hashedValue = btoa( JSON.stringify( controlData ) );

					var key = [ hashedValue, index ].join( ":" );

					var componentState = this.state.componentState;

					var hiddenControlList = this.getHiddenControlList( );

					var disabledControlList = this.getDisabledControlList( );

					var reference = controlData.reference;

					var name = controlData.name;

					var title = controlData.title || "";

					var icon = controlData.icon;

					var iconSource = controlData.iconSource;

					var isDescriptive = !_.isEmpty( title );

					var isIconic = !isDescriptive || !_.isEmpty( icon ); 

					var isHidden = _.contains( hiddenControlList, name ) || _.contains( hiddenControlList, reference );

					var isDisabled = _.contains( disabledControlList, name ) || _.contains( disabledControlList, reference );

					var style = { };
					if( isDescriptive && percentageWidth ){
						style.width = [ percentageWidth, "%" ].join( "" );
					}

					return (
						<div
							key={ key }
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
							value={ name }
							style={ style }>

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

				"onEachControlGroup": function onEachControlGroup( controlData, index ){
					var self = this;

					var hashedValue = btoa( JSON.stringify( controlData ) );

					var key = [ hashedValue, index ].join( ":" );

					var componentState = this.state.componentState;

					var controlList = controlData.controlList;

					var percentageWidth = Math.floor( 100 / controlList.length );

					return (
						<div
							key={ key }
							className={ [
								"control-group",
								"shown",
								"inline-block",
								( controlData.isSeparateGroup )? "separated" : "",
								controlData.name,
								componentState
							].join( " " ) }>
							{ 
								controlList.map( function onEachControlItemDelegate( controlData, index ){
									return self.onEachControlItem( controlData, percentageWidth, index );
								} )
							}
						</div>
					);
				},

				"onEachControl": function onEachControl( controlData, index ){
					if( "controlList" in controlData &&
						!controlData.isSeparateGroup
					){
						return this.onEachControlGroup( controlData, index );
					}
					
					return this.onEachControlItem( controlData, 0, index );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-control-list",
						function onSetControlList( controlList, isAppend ){
							var timeout = setTimeout( function onTimeout( ){
								self.setControlList( controlList, isAppend );

								clearTimeout( timeout );
							}, 100 );
						} );

					this.scope.on( "remove-control",
						function onRemoveControl( reference ){
							self.removeControl( reference );
						} );

					this.scope.on( "set-hidden-control-list",
						function onSetHiddenControlList( hiddenControlList ){
							self.setHiddenControlList( hiddenControlList );
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

							{
								_( controlList )
									.map( function onEachControlItem( controlData ){
										if( "controlList" in controlData &&
											"isSeparateGroup" in controlData &&
											controlData.isSeparateGroup )
										{
											return controlData;
										}
									} )
									.compact( )
									.value( )
									.map( this.onEachControlGroup ) 
							}
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
	
	.factory( "attachControl", [
		"$rootScope",
		"PageFlow",
		"Event",
		"Control",
		function factory( $rootScope, PageFlow, Event, Control ){
			var attachControl = function attachControl( optionSet ){
				var scope = optionSet.scope || $rootScope;

				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

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
			};

			return attachControl;
		}
	] )

	.directive( "control", [
		"attachControl",
		function directive( attachControl ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 2,
				"link": function onLink( scope, element, attributeSet ){
					attachControl( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet
					} );
				}
			};
		}
	] );
