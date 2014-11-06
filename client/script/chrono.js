angular.module( "Chrono", [ "Event" ] )
	.constant( "MONTH_LABEL", "month" )

	.constant( "DAY_LABEL",  "day" )
	
	.constant( "YEAR_LABEL", "year" )  
	
	.factory( "Chrono", [
		"MONTH_LABEL",
		"DAY_LABEL",
		"YEAR_LABEL",
		function factory( MONTH_LABEL, DAY_LABEL, YEAR_LABEL ){
			var Chrono = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						React.render( <Chrono scope={ scope } />, container[ 0 ] );
                                     
						return this;    
					},
					
					"getCurrentTimestamp": function getCurrentTimestamp( ){
						return parseInt( moment( ).valueOf( ) );
					},

					"getCurrentMonth": function getCurrentMonth( ){
						return parseInt( moment( ).format( "M" ) );
					},

					"getCurrentDay": function getCurrentDay( ){
						return parseInt( moment( ).format( "D" ) );
					},

					"getCurrentYear": function getCurrentYear( ){
						return parseInt( moment( ).format( "YYYY" ) );
					},

					"getTotalDayCount": function getTotalDayCount( month, year ){
						month = month || this.getCurrentMonth( );

						year = year || this.getCurrentYear( );

						return moment( )
							.month( month - 1 )
							.year( year )
							.daysInMonth( );
					},

					"formatMonth": function formatMonth( month ){
						var monthSequence = moment.months( ).join( "," ).toLowerCase( );
						
						if( ( /^\d{1,2}$/ ).test( month.toString( ) ) && 
							parseInt( month ) < 13 && 
							parseInt( month ) > -1 )
						{
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

					"abbreviateMonth": function abbreviateMonth( month ){
						month = this.formatMonth( month );
						
						return moment.month( month ).format( "MMM" ).toUpperCase( );
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"timestamp": 0,
						"month": 0,
						"day": 0,
						"year": 0,
						"formattedMonth": "",
						"totalDayCount": 0,
						"chronoState": "chrono-descriptive",
						"componentState": "chrono-normal"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"timestamp": this.getCurrentTimestamp( ),
						"month": this.getCurrentMonth( ),
						"day": this.getCurrentDay( ),
						"year": this.getCurrentYear( )
					};
				},

				"getMonth": function getMonth( ){
					return this.state.month || this.props.month;
				},

				"getDay": function getDay( ){
					return this.state.day || this.props.day;
				},

				"getYear": function getYear( ){
					return this.state.year || this.props.year;
				},

				"getTimestamp": function getTimestamp( ){
					return this.state.timestamp || this.props.timestamp;
				},
				  
				"incrementMonth": function incrementMonth( ){
					
				},
					
				"incrementDay": function incrementDay( ){
					
				},
					
				"incrementYear": function incrementYear( ){
					
				},
					
				"decrementMonth": function decrementMonth( ){
					
				},
					
				"decrementDay": function decrementDay( ){
					
				},
					
				"decrementYear": function decrementYear( ){
					
				},
					
				"onClickIncrementMonth": function onClickIncrementMonth( event ){
					this.incrementMonth( );        
				},
					
				"onClickIncrementDay": function onClickIncrementDay( event ){
					this.incrementDay( );
				},
			
				"onClickIncrementYear": function onClickIncrementYear( event ){
					this.incrementYear( );
				},
					
				"onClickDecrementMonth": function onClickDecrementMonth( event ){
					this.decrementMonth( );
				},
                    
				"onClickDecrementDay": function onClickDecrementDay( event ){
					this.decrementDay( );
				},
                    
				"onClickDecrementYear": function onClickDecrementYear( event ){
					this.decrementYear( );
				},
                    
				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					
				},

				"componentWillMount": function componentWillMount( ){
					
				},
				
				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){
					
				},
					
				"render": function onRender( ){
					var componentState = this.state.componentState;
                    
					var chronoState = this.state.chronoState;
                    
					var month = this.state.month;
                    
					if( chronoState == "chrono-minimal" ){
						month = this.abbreviateMonth( month );
					}else{
						month = this.formatMonth( month );
					}
                    
                    var day = this.state.day;
                    
                    var year = this.state.year;
                    
					return (
						<div
							className={ [
								"chrono-component-container",
                                chronoState,
                                componentState
							].join( " " ) }>
							<table
								className={ [
									"chrono-component",
                                    chronoState,
                                    componentState
								].join( " " ) }>
								<thead
                                    className={ [
                                        "header",
                                        chronoState,
                                        componentState
                                    ].join( " " ) }>
									<tr 
										className={ [
											"head-label-row",
											"label-row" 
										].join( " " ) }>
										<th
											className={ [
												"month-component",
												"label-container"
											].join( " " ) }>
											{ MONTH_LABEL.toUpperCase( ) }
										</th>
										<th
											className={ [
												"day-component",
												"label-container"
											].join( " " ) }>
											{ DAY_LABEL.toUpperCase( ) }
										</th>
										<th
											className={ [
												"year-component",
												"label-container"
											].join( " " ) }>
											{ YEAR_LABEL.toUpperCase( ) }
										</th>
									</tr>
								</thead>
								<tbody
                                    className={ [
                                        "body",
                                        chronoState,
                                        componentState
                                    ].join( " " ) }>
									<tr
										className={ [ 
											"increment-control-list"
										].join( " " ) }>
										<td
											className={ [
												"month-component",
												"increment-control-container"
											].join( " " ) }>
											<button
												className={ [
													"increment-month-control",
													"increment-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickIncrementMonth }>
											</button>
										</td>
										<td
											className={ [
												"day-component",
												"increment-control-container"
											].join( " " ) }>
											<button
												className={ [
													"increment-day-control",
													"increment-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickIncrementDay }>
											</button>
										</td>
										<td
											className={ [
												"year-component",
												"increment-control-container"
											].join( " " ) }>
											<button
												className={ [
													"increment-year-control",
													"increment-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickIncrementYear }>
											</button>
										</td>
									</tr>
									<tr
										className={ [ 
											"date-input-list"
										].join( " " ) }>
										<td
											className={ [
												"month-component",
												"input-container"
											].join( " " ) }>
											<input 
												className={ [
													"month-input",
													"input"
												].join( " " ) }
												type="text"
												value={ month }/>
										</td>
										<td
											className={ [
												"day-component",
												"input-container"
											].join( " " ) }>
											<input 
												className={ [
													"day-input",
													"input"
												].join( " " ) }
												type="text" />
										</td>
										<td
											className={ [
												"year-component",
												"input-container"
											].join( " " ) }>
											<input 
												className={ [
													"year-input",
													"input"
												].join( " " ) }
												type="text" />
										</td>
									</tr>
									<tr
										className={ [ 
											"decrement-control-list"
										].join( " " ) }>
										<td
											className={ [
												"month-component",
												"decrement-control-container"
											].join( " " ) }>
											<button
												className={ [
													"decrement-month-control",
													"decrement-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickDecrementMonth }>
											</button>
										</td>
										<td
											className={ [
												"day-component",
												"decrement-control-container"
											].join( " " ) }>
											<button
												className={ [
													"decrement-day-control",
													"decrement-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickDecrementDay }>
											</button>
										</td>
										<td
											className={ [
												"year-component",
												"decrement-control-container"
											].join( " " ) }>
											<button
												className={ [
													"decrement-year-control",
													"decrement-control",
													"control"
												].join( " " ) }
												onClick={ this.onClickDecrementYear }>
											</button>
										</td>
									</tr>
								</tbody>
								<tfoot
                                    className={ [
                                        "footer",
                                        chronoState,
                                        componentState
                                    ].join( " " ) }>
									<tr
										className={ [
											"footer-label-row",
											"label-row" 
										].join( " " ) }>
										<td
											className={ [
												"month-component",
												"label-container"
											].join( " " ) }>
											{ MONTH_LABEL.toUpperCase( ) }
										</td>
										<td
											className={ [
												"day-component",
												"label-container"
											].join( " " ) }>
											{ DAY_LABEL.toUpperCase( ) }
										</td>
										<td
											className={ [
												"year-component",
												"label-container"
											].join( " " ) }>
											{ YEAR_LABEL.toUpperCase( ) }
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
					);
				}
			} );

			return Chrono;
		}
	] )
	
	.directive( "chrono", [
		"Event",
		"Chrono",
		function directive( Chrono ){
			return {
				"restrict": "EA",
				"scope": true,
				"link": function onLink( scope, element, attributeList ){
					Event( scope );
					
					Chrono.attach( scope, element );    
				}
			}
		}
	] );

