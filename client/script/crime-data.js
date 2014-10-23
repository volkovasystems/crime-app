Crime.directive( "crimeData", [
	"PageFlow",
	function directive( PageFlow ){
		var PRIVATE_DATA_PATTERN = /^_/;

		var crimeData = React.createClass( {
			"getInitialState": function getInitialState( ){
				return {
					"dataList": [ ],
					"columnList": [ ],
					"columnSet": { },
					"columnDataSet": { },
					"dataReference": "",
					"groupReference": "",
					"groupSet": { },
					"collapsedGroupList": [ ],
					"componentState": "data-standby"
				};
			},

			"getColumnSet": function getColumnSet( columnList ){
				var columnSet = _( columnList )
					.pluck( "name" )
					.object( columnList )
					.value( );

				this.setState( {
					"columnSet": columnSet
				} );
			},

			"getColumnList": function getColumnList( dataList ){
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
			},

			"reconstructGroupSet": function reconstructGroupSet( groupReference ){
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

			"loadDataList": function loadDataList( dataList, dataSetting ){
				this.setState( {
					"dataList": dataList,
					"dataReference": dataSetting.dataReference,
					"groupReference": dataSetting.groupReference,
					"columnDataSet": dataSetting.columnDataSet
				} );
			},

			"updataDataList": function updataDataList( dataList ){
			 	this.setState( {
					"dataList": dataList
			    } );
			},

			"updateDataSetting": function updateDataSetting( dataSetting ){
				this.setState( {
					"dataReference": dataSetting.dataReference,
					"groupReference": dataSetting.groupReference,
					"columnDataSet": dataSetting.columnDataSet
				} );
			},

			"viewDataList": function viewDataList( ){

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

			"componentWillMount": function componentWillMount( ){
			},

			"render": function onRender( ){
				var componentState = this.state.componentState;
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

							{ _.map( groupSet, this.onEachGroup ) }

							{ this.renderDataList( ) }

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
					this.getColumnList( this.state.dataList );
				}

				if( !_.isEqual( this.state.columnDataSet, prevState.columnDataSet ) ){

				}

				if( !_.isEqual( this.state.columnList, prevState.columnList ) ){
					this.getColumnSet( this.state.columnList );
				}

				if( this.state.groupReference !== prevState.groupReference ){
					this.reconstructGroupSet( this.state.groupReference );
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