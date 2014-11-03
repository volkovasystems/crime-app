Crime.directive( "crimeData", [
	"PageFlow",
	function directive( PageFlow ){
		var PRIVATE_DATA_PATTERN = /^_/;

		var crimeData = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"dataList": [ ],
					"dataReference": "",

					"columnList": [ ],
					"columnSet": { },
					"columnDataSet": { },

					"groupSet": { },
					"collapsedGroupList": [ ],
					"groupReference": "",
					"groupingState": "grouping-disabled",

					"componentState": "data-standby"
				};
			},

			"createGroupSet": function createGroupSet( groupReference ){
				var dataList = this.state.dataList;

				var groupSet = _( dataList )
					.groupBy( function onEachData( data ){
						return data[ groupReference ];
					} )
					.value( );

				this.setState( {
					"groupSet": groupSet
				} );
			},

			"enableGrouping": function enableGrouping( ){
				this.setState( {
					"groupingState": "grouping-enabled"
				} );
			},

			"disableGrouping": function disableGrouping( ){
				this.setState( {
					"groupingState": "grouping-disabled"
				} );
			},

			"updateGroupSet": function updateGroupSet( groupingState ){
				if( groupingState == "grouping-disabled" ){
					this.setState( {
						"groupSet": { }
					} );

				}else if( groupingState == "grouping-enabled" ){
					//: @todo: Should we request for an update of database?
				}
			},

			"constructColumnSet": function getColumnSet( columnList ){
				var columnSet = _( columnList )
					.pluck( "name" )
					.object( columnList )
					.value( );

				this.setState( {
					"columnSet": columnSet
				} );
			},

			"createColumnList": function createColumnList( dataList ){
				var columnList = _( dataList )
					.first( )
					.keys( )
					.map( function onEachKey( key ){
						return {
							"name": key,
							"title": S( key ).stripPunctuation( ).toUpperCase( ).toString( ),
							"order": "default",
							"isPrivate": PRIVATE_DATA_PATTERN.test( key ),
							"isHidden": PRIVATE_DATA_PATTERN.test( key ),
							"isCollapsed": false
						};
					} )
					.value( );

				this.setState( {
					"columnList": columnList
				} );
			},

			"updateColumnData": function updateColumnData( columnDataSet ){
				var columnList = this.state.columnList;

				columnList = _( columnList )
					.groupBy( function onEachColumn( columnData ){
						return columnData.name;
					} )
					.map( function onEachGroup( columnDataList, columnName ){
						var columnData = columnDataList[ 0 ];

						return _.extend( columnData, columnDataSet[ columnName ] );
					} );

				this.setState( {
					"columnList": columnList
				} );
			},

			"loadDataList": function loadDataList( dataList, dataSetting ){
				this.setState( {
					"dataList": dataList,
					"dataReference": dataSetting.dataReference || "",
					"groupReference": dataSetting.groupReference || "",
					"columnDataSet": dataSetting.columnDataSet || ""
				} );
			},

			"updateDataList": function updateDataList( dataList ){
			 	this.setState( {
					"dataList": dataList
			    } );
			},

			"updateDataSetting": function updateDataSetting( dataSetting ){
				this.setState( {
					"dataReference": dataSetting.dataReference || this.state.dataReference,
					"groupReference": dataSetting.groupReference || this.state.groupReference,
					"columnDataSet": dataSetting.columnDataSet || this.state.columnDataSet
				} );
			},

			"onEachColumnHeader": function onEachColumnHeader( columnData, index ){
				var isHidden = columnData.isHidden;

				var isCollapsed = columnData.isCollapsed;

				var name = columnData.name;

				var title = columnData.title;

				var key = [ name, index ].join( ":" );

				return (
					<th
						key={ key }
						className={ [
							"column-header",
							"column",
							( isHidden )? "hidden": "shown",
							( isCollapsed )? "collapsed": "expanded"
						].join( " " ) }
						value={ name }
						data-index={ index }>
						{ title }
					</th>
				);
			},

			"onEachColumnFooter": function onEachColumnFooter( columnData ){
				var isHidden = columnData.isHidden;

				var isCollapsed = columnData.isCollapsed;

				var name = columnData.name;

				var title = columnData.title;

				var key = [ name, index ].join( ":" );

				return (
					<td
						key={ key }
						className={ [
							"column-footer",
							"column",
							( isHidden )? "hidden": "shown",
							( isCollapsed )? "collapsed": "expanded"
						].join( " " ) }
						value={ name }
						data-index={ index }>
						{ title }
					</td>
				);
			},

			"onDataElementClick": function onDataElementClick( event ){
				this.props.scope.$root.$broadcast( "data-element-clicked", event.currentTarget, this );
			},

			"onActionCellClick": function onActionCellClick( event ){
				this.props.scope.$root.$broadcast( "action-cell-clicked", event.currentTarget, this );
			},

			"onExtendedCellClick": function onActionCellClick( event ){
				this.props.scope.$root.$broadcast( "extended-cell-clicked", event.currentTarget, this );
			},

			"onEachDataElement": function onEachDataElement( value, columnName ){
				var columnSet = this.state.columnSet;

				var columnData = columnSet[ columnName ];

				var hashedValue = btoa( value.toString( ) );

				var key = [ hashedValue, columnName ].join( ":" );

				var id = hashedValue;

				var isHidden = columnData.isHidden;

				var isCollapsed = columnData.isCollapsed;

				return (
					<td
						id={ id }
						key={ key }
						className={ [
						    "data-element",
							( isHidden )? "hidden": "shown",
							( isCollapsed )? "collapsed": "expanded"
						].join( " " ) }
						value={ hashedValue }
						onClick={ this.onDataElementClick }>

						<span
							className={ [
							    "action-cell"
							].join( " " ) }
							onClick={ this.onActionCellClick }>
							{ value || "" }
						</span>

						<div
							className={ [
							    "extended-cell"
							].join( " " ) }
							onClick={ this.onExtendedCellClick }>
						</div>
					</td>
				);
			},

			"onDataRowClick": function onDataRowClick( event ){
				this.props.scope.$root.$broadcast( "data-row-clicked", event.currentTarget, this );
			},

			"onEachDataRow": function onEachDataRow( data, index ){
				var hashedValue = btoa( JSON.stringify( data ) );

				var key = [ hashedValue, index ].join( ":" );

				var id = data._id || hashedValue;

				return (
					<tr
						id={ id }
						key={ key }
						className={ [
						    "data-row"
						].join( " " ) }
						value={ hashedValue }
						onClick={ this.onDataRowClick }>
						{ _.map( data, this.onEachDataElement ) }
					</tr>
				);
			},

			"onGroupHeaderClick": function onGroupHeaderClick( event ){
				var collapsedGroupList = this.state.collapsedGroupList;

				var groupName = event.currentTarget.props.value;

				if( _.contains( collapsedGroupList, groupName ) ){
					this.setState( {
						"collapsedGroupList": _.without( collapsedGroupList, groupName )
					} );

				}else{
					this.setState( {
						"collapsedGroupList": collapsedGroupList.concat( [ groupName ] )
					} );
				}
			},

			"onEachGroup": function onEachGroup( groupData, groupName ){
				var hashedValue = btoa( JSON.stringify( groupData ) );

				var key = [ hashedValue, groupName ].join( ":" );

				var collapsedGroupList = this.state.collapsedGroupList;

				var isCollapsed = _.contains( collapsedGroupList, groupName );

				var id = hashedValue;

				return (
					<tbody
						id={ id }
						key={ key }
						className={ [
							"data-group",
							"group"
						].join( " " ) }>

						<tr
							className={ [
								"group-header",
								( isCollapsed )? "collapsed" : "expanded"
							].join( " " ) }
							onClick={ this.onGroupHeaderClick }
							value={ groupName }>
							<td>
								{ groupName.toUpperCase( ) }
							</td>
						</tr>

						{ ( isCollapsed )? groupData.map( this.onEachDataRow ) : "" }
					</tbody>
				)
			},

			"renderDataList": function renderDataList( ){
				var dataList = this.state.dataList;

				return (
					<tbody
						className={ [
							"data-list"
						].join( " " ) }>

						{ dataList.map( this.onEachDataRow ) }
					</tbody>
				);
			},

			"attachAllComponentEventListener": function attachAllComponentEventListener( ){
				this.props.scope.$on( "load-data-list",
					function onLoadDataList( event, dataList, dataSetting ){

					} );

				this.props.scope.$on( "update-data-list",
					function onUpdateDataList( event, dataList ){

					} );

				this.props.scope.$on( "update-data-setting",
					function onUpdateDataSetting( ){

					} );
			},

			"componentWillMount": function componentWillMount( ){
				this.attachAllComponentEventListener( );
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;

				var groupingState = this.state.groupingState;

				var groupSet = this.state.groupSet;

				var columnList = this.state.columnList;

				return (
					<div
						className={ [
							"crime-data-container",
							componentState
						].join( " " ) }>
						<table
							className={ [
								"data-table"
							].join( " " ) }>
							<thead
								className={ [
									"data-header"
								].join( " " ) }>
								<tr>
									{ columnList.map( this.onEachColumnHeader ) }
								</tr>
							</thead>

							{ ( groupingState == "grouping-enabled" )? _.map( groupSet, this.onEachGroup ) : "" }

							{ ( groupingState == "grouping-disabled" )? this.renderDataList( ) : "" }

							<tfoot
								className={ [
									"data-footer"
								].join( " " ) }>
								<tr>
									{ columnList.map( this.onEachColumnFooter ) }
								</tr>
							</tfoot>
						</table>
					</div>
				);
			},

			"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
				if( !_.isEqual( this.state.dataList, prevState.dataList ) ){
					this.createColumnList( this.state.dataList );
				}

				if( !_.isEqual( this.state.columnDataSet, prevState.columnDataSet ) ){
					this.updateColumnData( this.state.columnDataSet );
				}

				if( !_.isEqual( this.state.columnList, prevState.columnList ) ){
					this.constructColumnSet( this.state.columnList );
				}

				if( this.state.groupReference !== prevState.groupReference ){
					this.createGroupSet( this.state.groupReference );
					this.enableGrouping( );
				}

				if( this.state.groupingState != prevState.groupingState ){
					this.updateGroupSet( this.state.groupingState );

					this.props.scope.$root.$broadcast( "data-grouping-state-changed", groupingState, this );
				}
			},

			"componentDidMount": function componentDidMount( ){
				this.props.scope.$root.$broadcast( "crime-data-rendered" );
			}
		} );

		return {
			"restrict": "EA",
			"scope": true,
			"link": function onLink( scope, element, attributeSet ){
				PageFlow( scope, element, "data" );

				scope.reflow( "hidden", "data-standby" );

				scope.$on( "show-data",
					function onShowData( ){
						scope.applyFlow( "shown" );
					} );

				scope.$on( "hide-data",
					function onHideData( ){
						scope.applyFlow( "hidden" );
					} );

				React.renderComponent( <crimeData scope={ scope } />, element[ 0 ] );
			}
		};
	}
] );