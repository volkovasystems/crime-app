var Crime = angular.module( "Crime", [ "ui.bootstrap" ] );

Crime.value( "pageList", [ ] );

Crime.factory( "PageFlow", [
	"pageList",
	function factory( pageList ){
		var PageFlow = function PageFlow( page, pageContainer, namespace ){
			if( this instanceof PageFlow ){
				this.namespace = namespace || "";

				this.registerPage( page, pageContainer );

			}else{
				new PageFlow( page, pageContainer, namespace );
			}
		}; 

		PageFlow.prototype.namespace = "";

		PageFlow.prototype.page = null;

		PageFlow.prototype.pageContainer = null;

		PageFlow.prototype.flowList = [ ];

		PageFlow.prototype.applyFlow = function applyFlow( flowList ){
			flowList = _.flatten( _.toArray( arguments ) );
			
			this.flowList = _.union( this.flowList, flowList );

			if( this.namespace && 
				!_.contains( this.flowList, this.namespace ) )
			{
				this.flowList.push( this.namespace );
			}
			
			this.pageContainer.addClass( this.flowList.join( " " ) );

			return this;
		};

		PageFlow.prototype.clearFlow = function clearFlow( ){
			this.pageContainer.removeClass( this.flowList.join( " " ) );
			this.flowList = [ this.namespace || "" ];

			return this;
		};

		PageFlow.prototype.reflow = function reflow( flowList ){
			this.clearFlow( ).applyFlow.apply( this, _.toArray( arguments ) );

			return this;
		};

		PageFlow.prototype.removeFlow = function removeFlow( flowList ){
			flowList = _.flatten( _.toArray( arguments ) );
			this.flowList = _.without.apply( null, [ this.flowList ].concat( flowList ) );

			if( this.namespace && 
				!_.contains( this.flowList, this.namespace ) )
			{
				this.flowList.push( this.namespace );
			}

			if( _.contains( flowList, this.namespace ) ){
				flowList = _.without( flowList, this.namespace );
			}

			this.pageContainer.removeClass( flowList.join( " " ) );

			return this;
		};

		PageFlow.prototype.toggleFlow = function toggleFlow( flowPatternList, flowList ){
			flowList = _.flatten( _.toArray( arguments ) )
				.filter( function onEachFlow( flow ){
					return !S( flow ).endsWith( "*" );
				} );

			flowPatternList = new RegExp( _.flatten( _.toArray( arguments ) )
				.filter( function onEachFlow( flow ){
					return S( flow ).endsWith( "*" );
				} )
				.map( function onEachFlowPattern( flowPattern ){
					return "(@pattern)".replace( "@pattern", flowPattern.replace( "*", "[^\\s]+" ) );
				} )
				.join( "|" ), "g" );

			this.removeFlow( this.flowList.join( " " ).match( flowPatternList ) );

			this.applyFlow( flowList );

			return this;
		};

		PageFlow.prototype.hideOtherPage = function hideOtherPage( ){
			var self = this;

			pageList.forEach( function onEachPageList( page ){
				if( this.page !== page ){
					page.wholePageUp( );
				}
			} );

			return this;
		};

		PageFlow.prototype.hideAllPage = function hideAllPage( ){
			var self = this;

			pageList.forEach( function onEachPageList( page ){
				page.wholePageUp( );
			} );

			return this;
		};

		PageFlow.prototype.registerPage = function registerPage( page, pageContainer ){
			pageList.push( page );

			this.page = page;

			this.pageContainer = pageContainer;

			var self = this;

			this.page.hideAllPage = function hideAllPage( ){
				PageFlow.prototype.hideAllPage.apply( self );

				return self.page;
			};

			this.page.hideOtherPage = function hideOtherPage( ){
				PageFlow.prototype.hideOtherPage.apply( self );

				return self.page;
			};

			this.page.applyFlow = function applyFlow( flowList ){
				PageFlow.prototype.applyFlow.apply( self, _.toArray( arguments ) );

				return self.page;
			};

			this.page.clearFlow = function clearFlow( ){
				PageFlow.prototype.clearFlow.apply( self );

				return self.page;
			};

			this.page.reflow = function reflow( flowList ){
				PageFlow.prototype.reflow.apply( self, _.toArray( arguments ) );

				return self.page;
			}

			this.page.removeFlow = function removeFlow( flowList ){
				PageFlow.prototype.removeFlow.apply( self, _.toArray( arguments ) );

				return self.page;
			};

			this.page.toggleFlow = function toggleFlow( flowPatternList, flowList ){
				PageFlow.prototype.toggleFlow.apply( self, _.toArray( arguments ) );

				return self.page;
			};

			this.page.halfPage = function halfPage( ){
				self.reflow( "half-page" );

				return self.page;
			};

			this.page.halfPageRight = function halfPageRight( ){
				self.reflow( "half-page", "half-page-right" );

				return self.page;
			};

			this.page.halfPageLeft = function halfPageLeft( ){
				self.reflow( "half-page", "half-page-left" );

				return self.page;
			};

			this.page.wholePage = function wholePage( ){
				self.reflow( "whole-page" );

				return self.page;
			};

			this.page.wholePage = function wholePage( ){
				self.reflow( "whole-page", "whole-page-center" );

				return self.page;
			};

			this.page.wholePageLeft = function wholePageLeft( ){
				self.reflow( "whole-page", "whole-page-left" );

				return self.page;
			};

			this.page.wholePageRight = function wholePageRight( ){
				self.reflow( "whole-page", "whole-page-right" );

				return self.page;
			};

			this.page.wholePageUp = function wholePageUp( ){
				self.reflow( "whole-page", "whole-page-up" );

				return self.page;
			};

			this.page.wholePageDown = function wholePageDown( ){
				self.reflow( "whole-page", "whole-page-down" );

				return self.page;
			};

			this.page.wholePageCenter = function wholePageCenter( ){
				self.reflow( "whole-page", "whole-page-center" );

				return self.page;
			};
		};

		return PageFlow;
	}
] );

Crime.run( [
	"$rootScope",
	function onRun( $rootScope ){
		var mapLoaded = $rootScope.$on( "map-loaded", 
			function onMapLoaded( ){		
				$rootScope.$broadcast( "show-zen-map" );

				mapLoaded( );

				loggedIn( );
			} );

		var loggedIn = $rootScope.$on( "logged-in",
			function onLoggedIn( ){
				mapLoaded( );

				loggedIn( );
			} );

		async.parallel( [
			function checkRender( callback ){
				$rootScope.$on( "crime-home-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-dashbar-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-header-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-login-rendered", function onRendered( ){ callback( ); } );
			},
			function checkRender( callback ){
				$rootScope.$on( "crime-notify-rendered", function onRendered( ){ callback( ); } );
			}
			/*function checkRender( callback ){
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
				$rootScope.$on( "crime-report-rendered", function onRendered( ){ callback( ); } );
			},*/
		],
			function lastly( ){
				$rootScope.$broadcast( "show-default-page" );
			} );
	}
] );

Crime.run( [
	"$rootScope",
	function onRun( $rootScope ){
		$( window ).resize( function onResize( ){
			var bodyWidth = $( "body" ).width( ).toString( ).replace( "px", "" );
			bodyWidth = parseInt( bodyWidth );

			if( bodyWidth < 768 ){
				$rootScope.$broadcast( "window-extra-small-mode" );

			}else if( bodyWidth >= 768 ){
				$rootScope.$broadcast( "window-small-mode" );

			}else if( bodyWidth >= 992 ){
				$rootScope.$broadcast( "window-medium-mode" );

			}else{
				$rootScope.$broadcast( "window-large-mode" );
			}
		} );
	}
] );