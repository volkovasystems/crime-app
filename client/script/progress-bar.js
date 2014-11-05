angular.module( "ProgressBar", [ "cfp.loadingBar" ] )
	.config( [ 
		"cfpLoadingBarProvider", 
		function onConfigure( cfpLoadingBarProvider ){
			cfpLoadingBarProvider.includeSpinner = false;
		}
	] )

	.factory( "startLoading", [
		"cfpLoadingBar",
		function factory( cfpLoadingBar ){
			return function startLoading( ){
				cfpLoadingBar.start( );
			};
		}
	] )
	
	.factory( "finishLoading", [
		"cfpLoadingBar",
		function factory( cfpLoadingBar ){
			return function finishLoading( ){
				cfpLoadingBar.complete( );
			};	
		}
	] )

	.factory( "ProgressBar", [
		"startLoading",
		"finishLoading",
		"$timeout",
		function factory( startLoading, finishLoading, $timeout ){
			var ProgressBar = function ProgressBar( initiator ){
				if( this instanceof ProgressBar ){
					this.initiator = initiator;

					var self = this;

					this.initiator.startLoading = function startLoading( ){
						$timeout( function onTimeout( ){
							self.start( );
						}, 1 );
						
						return self.initiator;
					};

					this.initiator.finishLoading = function finishLoading( ){
						$timeout( function onTimeout( ){
							self.finish( );
						}, 1 );

						return self.initiator;
					}

				}else{
					return new ProgressBar( initiator );
				}
			};

			ProgressBar.prototype.initiator = null;

			ProgressBar.prototype.start = function start( ){
				startLoading( );
			};

			ProgressBar.prototype.finish = function finish( ){
				finishLoading( );
			};

			return ProgressBar;
		}
	] )

	.run( [
		"$rootScope",
		"Event",
		"startLoading",
		"finishLoading",
		function onRun( $rootScope, Event, startLoading, finishLoading ){
			Event( $rootScope );

			$rootScope.subscribe( "start-loading",
				function onStartLoading( ){
					startLoading( );
				} );

			$rootScope.subscribe( "finish-loading",
				function onFinishLoading( ){
					finishLoading( );
				} );
		}
	] );