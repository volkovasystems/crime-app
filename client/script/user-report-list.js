angular.module( "UserReportList", [ "Event", "PageFlow" ] )

	.factory( "UserReportList", [ 
		function factory( ){
			var UserReportList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var userReportListComponent = (
							<UserReportList 
								scope={ scope } />
						)

						React.render( userReportListComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"reportList": [ ]
					};
				},

				"onClickCloseUserReportList": function onClickCloseUserReportList( ){
					this.scope.publish( "close-user-report-list" );
				},

				"attachAllComponentEventListener": function attachAllComponentEventListener( ){
					var self = this;

					this.scope.on( "set-user-report-list",
						function onSetUserReportList( reportList ){
							self.setState( {
								"reportList": reportList
							} );
						} );

					this.scope.on( "clear-user-report-list",
						function onClearUserReportList( reportList ){
							self.setState( {
								"reportList": [ ]
							} );
						} );
				},

				"componentWillMount": function componentWillMount( ){
					this.scope = this.props.scope;

					this.attachAllComponentEventListener( );
				},

				"onEachReportItem": function onEachReportItem( reportData ){
					var reportTimestamp = reportData.reportTimestamp.toString( );

					var reportTime = moment( reportTimestamp ).format( "hh:mm A" );

					var reportDate = moment( reportTimestamp ).format( "MMMM DD, YYYY" );

					var reportStatus = S( reportData.reportState ).capitalize( ).toString( );	

					return; //: @template: template/user-report-item.html
				},

				"render": function onRender( ){
					var reportList = this.state.reportList;

					return; //: @template: template/user-report-list.html
				},

				"componentDidMount": function componentDidMount( ){
					this.scope.broadcast( "user-report-list-rendered" );	
				}
			} );

			return UserReportList;
		}
	] )

	.factory( "attachUserReportList", [
		"$rootScope",
		"Event",
		"PageFlow",
		"UserReportList",
		function factory(
			$rootScope,
			Event,
			PageFlow,
			UserReportList
		){
			var attachUserReportList = function attachUserReportList( optionSet ){
				var element = optionSet.element;

				if( _.isEmpty( element ) || element.length == 0 ){
					throw new Error( "unable to attach component" );
				}

				var scope = optionSet.scope || $rootScope;

				scope = scope.$new( true );

				if( optionSet.embedState != "no-embed" ){
					scope = scope.$new( true );
				}

				Event( scope );

				var pageFlow = PageFlow( scope, element, "user-report-list overflow" );

				if( optionSet.embedState != "no-embed" ){
					pageFlow.namespaceList = _.without( pageFlow.namespaceList, "page" );
				}

				scope.on( "show-user-report-list",
					function onShowUserReportList( ){
						scope.showPage( );
					} );

				scope.on( "hide-user-report-list",
					function onHideUserReportList( ){
						scope.hidePage( );
					} );

				scope.publish( "hide-user-report-list" );

				UserReportList.attach( scope, element );
			};

			return attachUserReportList;
		}
	] )

	.directive( "userReportList", [
		"attachUserReportList",
		function directive( attachUserReportList ){
			return {
				"restrict": "EA",
				"scope": true,
				"priority": 3,
				"link": function onLink( scope, element, attributeSet ){
					attachUserReportList( {
						"scope": scope,
						"element": element,
						"attributeSet": attributeSet,
						"embedState": "no-embed"
					} );
				}
			};
		}
	] )