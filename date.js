<html>
	<head>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.3/moment.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/0.12.0/react.min.js"></script>
		<script src="http://fb.me/JSXTransformer-0.12.0.js"></script>
	</head>

	<body>
		<date />

		<script type="text/javascript">
			var Chrono = React.createClass( {
				"statics": {
					"MONTH_LABEL": "month",
					
					"DAY_LABEL": "day",
					
					"YEAR_LABEL": "year",

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
					}

					"getTotalDayCount": function getTotalDayCount( month, year ){
						month = month || this.getCurrentMonth( ) );

						year = year || this.getCurrentYear( );

						return moment( )
							.month( month - 1 )
							.year( year )
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

					"abbreviateMonth": function abbreviateMonth( month ){
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
						"totalDayCount": 0
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"timestamp": this.getCurrentTimestamp( )
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

				"render": function onRender( ){
					return (
						<div
							className={ [
								"chrono-component-container"
							].join( " " ) }>
							<table
								className={ [
									"chrono-component" 
								].join( " " ) }>
								<thead>
									<tr 
										className={ [
											"head-label-row",
											"label-row" 
										].join( " " ) }>
										<th>
											{ Chrono.MONTH_LABEL.toUpperCase( ); }
										</th>
										<th>
											{ Chrono.DAY_LABEL.toUpperCase( ); }
										</th>
										<th>
											{ Chrono.YEAR_LABEL.toUpperCase( ); }
										</th>
									</tr>
								</thead>
								<tbody>
								</tbody>
								<tfoot>
									<tr
										className={ [
											"head-label-row",
											"label-row" 
										].join( " " ) }>
										<td>
											{ Chrono.MONTH_LABEL.toUpperCase( ); }
										</td>
										<td>
											{ Chrono.DAY_LABEL.toUpperCase( ); }
										</td>
										<td>
											{ Chrono.YEAR_LABEL.toUpperCase( ); }
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
						
					)
				}
			} );	
		</script>
	</body>
</html>