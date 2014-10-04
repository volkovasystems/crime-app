var Crime = angular.module( "Crime", [ "ui.bootstrap" ] );

Crime.value( "pageList", [ ] );

Crime.factory( "PageFlow", [
	"pageList",
	function factory( pageList ){
		var PageFlow = function PageFlow( page, pageContainer ){
			if( this instanceof PageFlow ){
				this.registerPage( page, pageContainer );

			}else{
				new PageFlow( page, pageContainer );
			}
		}; 

		PageFlow.prototype.page = null;

		PageFlow.prototype.pageContainer = null;

		PageFlow.prototype.flowList = [ ];

		PageFlow.prototype.applyFlow = function applyFlow( flowList ){
			flowList = _.toArray( arguments );
			this.flowList = _.union( this.flowList, flowList );
			this.pageContainer.addClass( flowList.join( " " ) );
		};

		PageFlow.prototype.clearFlow = function clearFlow( ){
			this.pageContainer.removeClass( this.flowList.join( " " ) );
			this.flowList = [ ];
		};

		PageFlow.prototype.hideOtherPage = function hideOtherPage( ){
			var self = this;

			pageList.forEach( function onEachPageList( page ){
				if( this.page !== page ){
					page.wholePageUp( );
				}
			} );
		};

		PageFlow.prototype.hideAllPage = function hideAllPage( ){
			var self = this;

			pageList.forEach( function onEachPageList( page ){
				page.wholePageUp( );
			} );
		};

		PageFlow.prototype.registerPage = function registerPage( page, pageContainer ){
			pageList.push( page );

			this.page = page;

			this.pageContainer = pageContainer;

			var self = this;

			this.page.hideAllPage = function hideAllPage( ){
				PageFlow.prototype.hideAllPage.apply( self );
			};

			this.page.hideOtherPage = function hideOtherPage( ){
				PageFlow.prototype.hideOtherPage.apply( self );
			};

			this.page.applyFlow = function applyFlow( flowList ){
				PageFlow.prototype.applyFlow.apply( self, _.toArray( arguments ) );
			};

			this.page.clearFlow = function clearFlow( ){
				PageFlow.prototype.clearFlow.apply( self );
			};

			this.page.defaultPage = function defaultPage( ){
				self.clearFlow( );
				self.applyFlow( "default" );
			};

			this.page.halfPage = function halfPage( ){
				self.clearFlow( );
				self.applyFlow( "half-page" );
			};

			this.page.halfPageRight = function halfPageRight( ){
				self.clearFlow( );
				self.applyFlow( "half-page", "half-page-right" );
			};

			this.page.halfPageLeft = function halfPageLeft( ){
				self.clearFlow( );
				self.applyFlow( "half-page", "half-page-left" );
			};

			this.page.wholePage = function wholePage( ){
				self.clearFlow( );
				self.applyFlow( "whole-page" );
			};

			this.page.wholePage = function wholePage( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-center" );
			};

			this.page.wholePageLeft = function wholePageLeft( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-left" );
			};

			this.page.wholePageRight = function wholePageRight( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-right" );
			};

			this.page.wholePageUp = function wholePageUp( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-up" );
			};

			this.page.wholePageDown = function wholePageDown( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-down" );
			};

			this.page.wholePageCenter = function wholePageCenter( ){
				self.clearFlow( );
				self.applyFlow( "whole-page", "whole-page-center" );
			};
		};

		return PageFlow;
	}
] );

Crime.run( [
	"$rootScope",
	function onRun( $rootScope ){
		async.parallel( [
			function checkRender( callback ){
				$rootScope.$on( "crime-home-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-login-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-profile-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-locate-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-search-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-spinner-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-notify-rendered", function onRendered( ){ callback( ); } );
			}
		],
			function lastly( ){
				$rootScope.$broadcast( "show-default-page" );

				var mapLoaded = $rootScope.$on( "map-loaded", 
					function onMapLoaded( ){		
						$rootScope.$broadcast( "show-zen-map" );

						mapLoaded( );
					} );
			} );
	}
] );