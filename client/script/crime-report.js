Crime.directive( "crimeReport", [
	"PageFlow",
	function directive( PageFlow ){
		var crimeMapPositionPreview = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"previewPosition": null,
					"mapAddress": ""
				};
			},

			"constructStaticMapURL": function constructStaticMapURL( ){
				var latitude = this.state.previewPosition.lat( );
				var longitude = this.state.previewPosition.lng( );

				return [
					"https://maps.googleapis.com/maps/api/staticmap?",
					
					[ "center", 
						[ latitude, longitude ].join( "," ) 
					].join( "=" ),

					[ "zoom", 18 ].join( "=" ),

					[ "size", [ 500, 400 ].join( "x" ) ].join( "=" ),

					[ "markers", 
						[
							[ "color", "red" ].join( ":" ),
							[ latitude, longitude ].join( "," ) 
						].join( "%7C" )
					].join( "=" )
				].join( "&" );
			},

			"componentWillMount": function componentWillUpdate( ){
				var self = this;
				this.props.scope.$root.$on( "confirmed-map-data", 
					function onConfirmedMapData( event, previewPosition ){
						self.setState( {
							"previewPosition": previewPosition
						} );

						self.props.scope.$root.$broadcast( "search-map-at-position",
							previewPosition,
							function onSearchMapAtPosition( error, mapAddress ){
								self.setState( {
									"mapAddress": mapAddress
								} );
							} );
					} );
			},

			"render": function onRender( ){
				var staticMapURL = "";
				var latitude = "";
				var longitude = "";
				var mapAddress = this.state.mapAddress;
				if( this.state.previewPosition instanceof google.maps.LatLng ){
					staticMapURL = this.constructStaticMapURL( );

					latitude = this.state.previewPosition.lat( );
					longitude = this.state.previewPosition.lng( );

					var formatOption = { "notation": "fixed", "precision": 4 };
					latitude = math.format( latitude, formatOption );
					longitude = math.format( longitude, formatOption );
				}

				return (
					<div 
						className={ [
							"crime-map-position-preview-container",
							"row",
							( staticMapURL )? "" : "hidden"
						].join( " " ) } >

						<div
							className="map-preview"
							style={
								{
									"background-image": "url( \"@mapURL\" )".replace( "@mapURL", staticMapURL ),
									"background-position": "center center",
									"background-size": "100%",
									"background-repeat": "no-repeat"
								}
							}>
						</div>

						<p className="map-address bg-info text-center">
							{ mapAddress }<br />
							( { latitude + "\u00b0" }, { longitude + "\u00b0" } )
						</p>
					</div>
				);
			}
		} );

		var crimeTitleInput = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"crimeTitle": ""
				};
			},

			"onChange": function onChange( event ){
				this.setState( {
					"crimeTitle": event.target.value
				} );
			},

			"onKeyPress": function onKeyPress( event ){
				if( event.key == "Enter" ){
					this.props.parentComponent.setState( {
						"crimeTitle": this.state.crimeTitle
					} );
				}
			},

			"render": function onRender( ){
				return (
					<div 
						className={ [
							"crime-title-input-container",
							"input-container",
							"col-md-10",
							"col-md-offset-1"
						].join( " " ) }>

						<div 
							className={ [
								"input-group",
								"input-group-lg",
								"col-lg-12" 
							].join( " " ) }>

							<input
								className="crime-title-input form-control"
								type="text"
								placeholder="TITLE"
								value={ this.state.crimeTitle }
								onChange={ this.onChange }
								onKeyPress={ this.onKeyPress } />
						</div>
					</div>
				);
			}
		} );

		var crimeDescriptionInput = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"crimeDescription": ""
				};
			},

			"onChange": function onChange( event ){
				this.setState( {
					"crimeDescription": event.target.value
				} );
			},

			"onKeyPress": function onKeyPress( event ){
				if( event.key == "Enter" ){
					this.props.parentComponent.setState( {
						"crimeDescription": this.state.crimeDescription
					} );
				}
			},

			"render": function onRender( ){
				return (
					<div 
						className={ [
							"crime-description-input-container",
							"input-container",
							"col-md-10",
							"col-md-offset-1"
						].join( " " ) }>

						<textarea 
							className="crime-description-input form-control text-justify"
							placeholder="DESCRIPTION"
							rows="5"
							value={ this.state.crimeDescription }
							style={
								{
									"resize": "none"
								}
							}
							onChange={ this.onChange }
							onKeyPress={ this.onKeyPress }>
						</textarea>
					</div>
				);
			}
		} );

		var crimeDateInput = React.createClass( {
			"getInitialState": function getInitialState( ){
				var month = parseInt( moment( ).format( "M" ) );
				var day = parseInt( moment( ).format( "D" ) );
				var year = parseInt( moment( ).format( "YYYY" ) );
				var totalDayCount = this.getTotalDayCount( month, year );

				return {
					"crimeTimestamp": parseInt( moment( ).valueOf( ) ),
					
					"selectedMonth": month,
					"selectedDay": day,
					"selectedYear": year,

					"formattedMonth": this.formatMonth( month ),
					"totalDayCount": totalDayCount,

					"monthTimeout": null,
					"advanceOptionActive": false,
					"selectionState": "hidden"
				};
			},

			"getTotalDayCount": function getTotalDayCount( month, year ){
				return moment( )
					.month( ( month || this.state.selectedMonth ) - 1 )
					.year( year || this.state.selectedYear )
					.daysInMonth( );
			},

			"formatMonth": function formatMonth( month ){
				var monthSequence = moment.months( ).join( "," ).toLowerCase( );
				if( ( /^\d{1,2}$/ ).test( month ) && parseInt( month ) < 13 && parseInt( month ) > -1 ){
					month = ( parseInt( month ) || 1 ) % 13 - 1;

					return moment( ).month( month ).format( "MMMM" ).toUpperCase( );

				}else if( _.contains( monthSequence.split( "," ), month.toLowerCase( ) ) ||
					_.contains( monthSequence, month ) )
				{
					return moment( ).month( month ).format( "MMMM" ).toUpperCase( );	

				}else{
					return month;
				}
			},

			"onMonthChange": function onMonthChange( event ){
				if( this.state.monthTimeout ){
					clearTimeout( this.state.monthTimeout );
					this.state.monthTimeout = null;
				}

				var self = this;
				this.state.monthTimeout = setTimeout( function onTimeout( ){
					self.setState( {
						"selectedMonth": moment( ).month( self.state.formattedMonth ).format( "MM" ),
						"formattedMonth": self.formatMonth( self.state.formattedMonth )
					} );

					clearTimeout( self.state.monthTimeout );
					self.state.monthTimeout = null;
				}, 2500 );

				self.setState( {
					"formattedMonth": event.target.value
				} );
			},

			"onKeyDownMonth": function onKeyDownMonth( event ){
				var month = this.state.selectedMonth;

				if( event.key == "ArrowUp" ){
					month = ( month - 1 || 12 ) % 13;

					this.setState( {
						"selectedMonth": month,
						"formattedMonth": this.formatMonth( month )
					} );

				}else if( event.key == "ArrowDown" ){
					month = ( month + 1 ) % 13 || 1;
					
					this.setState( {
						"selectedMonth": month,
						"formattedMonth": this.formatMonth( month )
					} );
				}
			},

			"onDayChange": function onDayChange( event){
				this.setState( {
					"selectedDay": event.target.value
				} );
			},

			"onKeyDownDay": function onKeyDownDay( event ){
				var day = this.state.selectedDay;

				var totalDayCount = this.getTotalDayCount( );

				if( event.key == "ArrowUp" ){
					day = ( day - 1 ) || totalDayCount;

					this.setState( {
						"selectedDay": day,
					} );

				}else if( event.key == "ArrowDown" ){
					day = ( day + 1 ) % ( totalDayCount + 1 ) || 1;
					
					this.setState( {
						"selectedDay": day,
					} );
				}
			},

			"onYearChange": function onYearChange( event){
				this.setState( {
					"selectedYear": event.target.value
				} );
			},

			"onClickAdvanceOption": function onClickAdvanceOption( event ){
				this.setState( {
					"advanceOptionActive": !this.state.advanceOptionActive,
					"selectionState": "active"
				} );
			},

			"componentWillUpdate": function componentWillUpdate( ){

			},

			"shouldComponentUpdate": function shouldComponentUpdate( nextProps, nextState ){
				if( this.state.selectedDay != nextState.selectedDay ){
					return (
						/^\d{1,2}$/.test( nextState.selectedDay ) &&
						this.getTotalDayCount( ) >= nextState.selectedDay
					);
				}

				return true;
			},

			"render": function onRender( ){
				return (
					<div 
						className={ [
							"crime-date-input-container",
							"input-container",
							"col-md-10",
							"col-md-offset-1",
							( this.state.advanceOptionActive )? "hidden" : "shown"
						].join( " " ) }>

						<div className="input-group input-group-lg">
							<input 
								className={ [
									"month-input",
									"form-control"
								].join( " " ) }

								type="text" 
								ref="monthInput"
								placeholder={ this.state.formattedMonth }
								size="30"
								value={ this.state.formattedMonth }

								onChange={ this.onMonthChange } 
								onKeyDown={ this.onKeyDownMonth } />

							<span className="input-group-addon">/</span>

							<input 
								className={ [
									"day-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text" 
								ref="dayInput"
								placeholder={ this.state.selectedDay }
								value={ this.state.selectedDay }
								
								onChange={ this.onDayChange } 
								onKeyDown={ this.onKeyDownDay } />

							<span className="input-group-addon">/</span>

							<input 
								className={ [
									"year-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text" 
								ref="yearInput"
								placeholder={ this.state.selectedYear }
								value={ this.state.selectedYear }
								
								onChange={ this.onYearChange } />

							<span className="input-group-btn">
								<button 
									disabled="true"
									className={ [
										"advance-option-button",
										"btn",
										"btn-default",
										"btn-lg",
									].join( " " ) } 

									type="button"
									ref="advanceOptionButton"

									onClick={ this.onClickAdvanceOption }>

									<span className="glyphicon glyphicon-cog"></span>
								</button>
							</span>
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( prevState.selectedYear != this.state.selectedYear &&
					prevState.selectedMonth != this.state.selectedMonth &&
					this.getTotalDayCount( ) < this.selectedDay )
				{
					this.setState( {
						"selectedDay": this.getTotalDayCount( )
					} );

				}else if( prevState.selectedYear != this.state.selectedYear ||
					prevState.selectedMonth != this.state.selectedMonth )
				{
					this.setState( {
						"totalDayCount": this.getTotalDayCount( )
					} );
				}
			},

			"componentDidMount": function componentDidMount( ){

			}
		} );

		var crimeTimeInput = React.createClass( {
			"getInitialState": function getInitialState( ){
				var hour = parseInt( moment( ).format( "hh" ) );
				var minute = parseInt( moment( ).format( "mm" ) );
				var second = parseInt( moment( ).format( "ss" ) );
				var period = moment( ).format( "A" )

				return {
					"crimeTimestamp": parseInt( moment( ).valueOf( ) ),
					"selectedHour": "",
					"selectedMinute": "",
					"selectedSecond": "",
					"selectedPeriod": "",
					"advanceOptionActive": false,
					"selectionState": "hidden",
					"currentHour": hour,
					"currentMinute": minute,
					"currentSecond": second,
					"currentPeriod": period,
					"intervalEngine": null
				};
			},

			"onHourChange": function onHourChange( event ){
				this.setState( {
					"selectedHour": event.target.value
				} );
			},

			"onKeyDownHour": function onKeyDownHour( event ){
				var hour = this.state.selectedHour || this.state.currentHour;

				if( event.key == "ArrowUp" ){
					hour = ( hour - 1 ) || 12;

					this.setState( {
						"selectedHour": hour,
					} );

				}else if( event.key == "ArrowDown" ){
					hour = ( hour + 1 ) % ( 12 + 1 ) || 1;
					
					this.setState( {
						"selectedHour": hour,
					} );
				}
			},

			"onMinuteChange": function onMinuteChange( event ){
				this.setState( {
					"selectedMinute": event.target.value
				} );
			},

			"onKeyDownMinute": function onKeyDownMinute( event ){
				var minute = this.state.selectedMinute || this.state.currentMinute;

				if( event.key == "ArrowUp" ){
					minute = ( minute - 1 ) || 60;

					this.setState( {
						"selectedMinute": minute,
					} );

				}else if( event.key == "ArrowDown" ){
					minute = ( minute + 1 ) % ( 60 + 1 ) || 1;
					
					this.setState( {
						"selectedMinute": minute,
					} );
				}
			},

			"onSecondChange": function onSecondChange( event ){
				this.setState( {
					"selectedSecond": event.target.value
				} );
			},

			"onKeyDownSecond": function onKeyDownSecond( event ){
				var second = this.state.selectedSecond || this.state.currentSecond;

				if( event.key == "ArrowUp" ){
					second = ( second - 1 ) || 60;

					this.setState( {
						"selectedSecond": second,
					} );

				}else if( event.key == "ArrowDown" ){
					second = ( second + 1 ) % ( 60 + 1 ) || 1;
					
					this.setState( {
						"selectedSecond": second,
					} );
				}
			},

			"onPeriodChange": function onPeriodChange( event ){
				this.setState( {
					"selectedPeriod": event.target.value
				} );
			},

			"onKeyDownPeriod": function onKeyDownPeriod( event ){
				var period = this.state.selectedPeriod || this.state.currentPeriod;

				var periodList = [ "AM", "PM" ];

				if( event.key == "ArrowUp" ){
					var index = _.indexOf( periodList, period );
					index = Math.abs( ( index - 1 ) ) 

					this.setState( {
						"selectedPeriod": periodList[ index ],
					} );

				}else if( event.key == "ArrowDown" ){
					var index = _.indexOf( periodList, period );
					index = ( index + 1 ) % 2;
					
					this.setState( {
						"selectedPeriod": periodList[ index ],
					} );
				}
			},

			"onClickAdvanceOption": function onClickAdvanceOption( event ){
				this.setState( {
					"advanceOptionActive": !this.state.advanceOptionActive,
					"selectionState": "active"
				} );
			},

			"componentWillMount": function componentWillMount( ){

			},

			"shouldComponentUpdate": function shouldComponentUpdate( nextProps, nextState ){
				if( nextState.selectedHour > 12 && nextState.selectedHour < 1 ){
					return false;
				}

				if( nextState.selectedMinute > 60 && nextState.selectedMinute < 1 ){
					return false;
				}

				if( nextState.selectedSecond > 60 && nextState.selectedSecond < 1 ){
					return false;
				}

				if( nextState.selectedPeriod && 
					!( /am|pm/ ).test( nextState.selectedPeriod.toLowerCase( ) ) )
				{
					return false;
				}

				return true;
			},

			"render": function onRender( ){
				return (
					<div 
						className={ [
							"crime-time-input-container",
							"input-container",
							"col-md-10",
							"col-md-offset-1",
							( this.state.advanceOptionActive )? "hidden" : "shown"
						].join( " " ) }>

						<div className="input-group input-group-lg">
							<input 
								className={ [
									"hour-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text"
								ref="hourInput"
								placeholder={ this.state.currentHour }
								value={ this.state.selectedHour }
								
								onChange={ this.onHourChange }
								onKeyDown={ this.onKeyDownHour } />

							<span className="input-group-addon">:</span>

							<input 
								className={ [
									"minute-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text" 
								ref="minuteInput"
								placeholder={ this.state.currentMinute }
								value={ this.state.selectedMinute }
								
								onChange={ this.onMinuteChange } 
								onKeyDown={ this.onKeyDownMinute } />

							<span className="input-group-addon">:</span>

							<input 
								className={ [
									"second-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text" 
								ref="secondInput"
								placeholder={ this.state.currentSecond }
								value={ this.state.selectedSecond }
								
								onChange={ this.onSecondChange } 
								onKeyDown={ this.onKeyDownSecond } />

							<span className="input-group-addon"> </span>

							<input 
								className={ [
									"period-input",
									"form-control",
									"text-center"
								].join( " " ) }

								type="text" 
								ref="periodInput"
								placeholder={ this.state.currentPeriod }
								value={ this.state.selectedPeriod }
								
								onChange={ this.onPeriodChange }
								onKeyDown={ this.onKeyDownPeriod } />

							<span className="input-group-btn">
								<button 
									disabled="true"
									className={ [
										"advance-option-button",
										"btn",
										"btn-default",
									].join( " " ) } 

									type="button"
									ref="advanceOptionButton"

									onClick={ this.onClickAdvanceOption }>
									
									<span className="glyphicon glyphicon-cog"></span>
								</button>
							</span>
						</div>
					</div>
				);
			},

			"componentDidMount": function componentDidMount( ){
				var self = this;
				this.setState( {
					"intervalEngine": setInterval( function onInterval( ){
						self.setState( {
							"currentHour": parseInt( moment( ).format( "hh" ) ),
							"currentMinute": parseInt( moment( ).format( "mm" ) ),
							"currentSecond": parseInt( moment( ).format( "ss" ) ),
							"currentPeriod": moment( ).format( "A" )
						} );
					}, 25000 )
				} );
			}
		} );

		var crimeCategoryInput = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"crimeCategory": "",
					//TODO: This is just a dummy list of category crimes.
					"crimeCategoryList": [
						"HOMICIDE",
						"RAPE",
						"ESTAFA",
						"PHYSICAL INJURY"
					]
				};
			},

			"onClick": function onClick( event ){
				this.setState( {
					"crimeCategory": $( event.currentTarget ).attr( "value" )
				} );
			},

			"render": function onRender( ){
				var self = this;
				var onEachCrimeCategoryList = function onEachCrimeCategoryList( crimeCategory, index ){
					crimeCategory = crimeCategory.toUpperCase( );
					key = [ crimeCategory.toLowerCase( ), index ].join( ":" );

					return (
						<li
							key={ key }
							value={ crimeCategory }
							onClick={ self.onClick }>
							<a href="#">
								{ crimeCategory }
							</a>
						</li> 
					);
				};

				return (
					<div 
						className={ [
							"crime-category-input-container",
							"input-container",
							"btn-group",
							"col-md-10",
							"col-md-offset-1"
						].join( " " ) }>

						<button 
							type="button" 
							className="btn btn-default btn-lg col-lg-11">
							{ this.state.crimeCategory || "SELECT CATEGORY" }
						</button>

						<button 
							type="button" 
							className="btn btn-default btn-lg dropdown-toggle col-lg-1" 
							data-toggle="dropdown">
							<span className="caret"></span>
							<span className="sr-only">Toggle Dropdown</span>
						</button>

						<ul 
							className="dropdown-menu col-lg-12" 
							role="menu">
							{ this.state.crimeCategoryList.map( onEachCrimeCategoryList ) }
						</ul>
					</div>
				);
			}
		} );

		var crimeReport = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"crimeTitle": "",
					"crimeDescription": "",
					"crimeTimestamp": "",
					"crimeCategory": "",
					"confirmedPosition": null
				};
			},

			"onClickCancel": function onClick( event ){
				this.props.scope.$root.$broadcast( "hide-reporting" );
				this.props.scope.$root.$broadcast( "show-map-search" );
				this.props.scope.$root.$broadcast( "show-normal-map" );
			},

			"onClickReport": function onClick( event ){
			},

			"componentWillMount": function componentWillMount( ){
				var self = this;
				this.props.scope.$root.$on( "confirmed-map-data", 
					function onConfirmedMapData( event, confirmedPosition ){
						self.setState( {
							"confirmedPosition": confirmedPosition
						} );
					} );
			},

			"render": function onRender( ){
				return ( 
					<div className="crime-report-container">
						<div 
							className={ [
								"report-form-container",
								"panel",
								"panel-default",
								"container",
								"row",
								"col-lg-4",
								"col-lg-offset-4"
							].join( " " ) }>

							<div className="crime-report-header panel-heading row">
								<span className="panel-title">REPORT A CRIME</span>
							</div>

							<div className="crime-report-body panel-body row">
								<crimeMapPositionPreview 
									scope={ this.props.scope }
									parentComponent={ this } />

								<crimeTitleInput 
									scope={ this.props.scope }
									parentComponent={ this }
									crimeTitle={ this.state.crimeTitle } />

								<crimeDateInput 
									scope={ this.props.scope }
									parentComponent={ this }
									crimeTimestamp={ this.state.crimeTimestamp } />

								<crimeTimeInput 
									scope={ this.props.scope }
									parentComponent={ this }
									crimeTimestamp={ this.state.crimeTimestamp } />
								
								<crimeCategoryInput 
									scope={ this.props.scope }
									parentComponent={ this }
									crimeCategory={ this.state.crimeCategory } />

								<crimeDescriptionInput 
									scope={ this.props.scope }
									parentComponent={ this }
									crimeDescription={ this.state.crimeDescription } />
							</div>

							<div className="crime-report-footer panel-footer row">
								<button 
									type="button" 
									className="btn btn-primary btn-lg pull-right"
									onClick={ this.onClickReport }>
									REPORT
								</button>

								<button 
									type="button" 
									className="btn btn-default btn-lg pull-right"
									onClick={ this.onClickCancel }>
									CANCEL
								</button>
							</div>
						</div>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-report-rendered" );	
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element );

				scope.wholePageUp( );

				scope.$on( "show-reporting",
					function onShowReporting( ){
						scope.wholePageCenter( );
					} );

				scope.$on( "hide-reporting",
					function onHideReporting( ){
						scope.wholePageUp( );
					} );

				React.renderComponent( <crimeReport scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );