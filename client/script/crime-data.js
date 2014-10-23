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

			"loadDataList": function loadDataList( dataList, dataReference, groupReference ){
				this.setState( {
					"dataList": dataList,
					"dataReference": dataReference,
					"groupReference": groupReference
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
					<td
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
					</td>
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

			"onEachData": function onEachData( data, index ){

			},

			"onGroupHeaderClick": function onGroupHeaderClick( event ){

			},

			"onEachGroup": function onEachGroup( groupData, groupName ){
				var key = groupName;

				var collapsedGroupList = this.state.collapsedGroupList;

				var isCollapsed = _.contains( collapsedGroupList, groupName );

				return (
					<tbody
						key={ key }
						className={ [
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

						{ ( isCollapsed )? groupData.map( this.onEachData ) : "" }
					</tbody>
				)
			},

			"renderDataList": function renderDataList( ){
				var dataList = this.state.dataList;
				var columnSet = this.state.columnSet;

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
						<table>
							<thead>
								<tr>
									{ columnList.map( this.onEachColumnHeader ) }
								</tr>
							</thead>

							{ _.map( groupSet, this.onEachGroup ) }

							{ this.renderDataList( ) }

							<tfoot>
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