angular.module( "Event", [ ] )

	.constant( "EVENT_ENGINE_LIST", [ ] )

	.factory( "checkIfEventEngineIsRegisteredInEventEngineList", [
		"EVENT_ENGINE_LIST",
		function factory( EVENT_ENGINE_LIST ){
			return function checkIfEventEngineIsRegisteredInEventEngineList( eventEngine ){
				return _.contains( EVENT_ENGINE_LIST, eventEngine );
			};
		}
	] )

	.factory( "getEventEngineList", [
		"EVENT_ENGINE_LIST",
		function factory( EVENT_ENGINE_LIST ){
			return function getEventEngineList( ){
				return  EVENT_ENGINE_LIST.map( function onEachEventEngine( eventEngine ){
					return eventEngine;
				} );
			};
		}
	] )

	.factory( "registerEventEngine", [
		"EVENT_ENGINE_LIST",
		"checkIfEventEngineIsRegisteredInEventEngineList",
		function factory( 
			EVENT_ENGINE_LIST, 
			checkIfEventEngineIsRegisteredInEventEngineList 
		){
			return function registerEventEngine( eventEngine ){
				if( !checkIfEventEngineIsRegisteredInEventEngineList( eventEngine ) ){
					EVENT_ENGINE_LIST.push( eventEngine );
				}	
			};
		}
	] )

	.factory( "isEventEngineRegistered", [
		"checkIfEventEngineIsRegisteredInEventEngineList",
		function factory( checkIfEventEngineIsRegisteredInEventEngineList ){
			return function isEventEngineRegistered( eventEngine ){
				return checkIfEventEngineIsRegisteredInEventEngineList( eventEngine );
			};
		}
	] )

	.constant( "HANDLER_SET", { } )

	.constant( "EVENT_HANDLER_SET", { } )

	.factory( "checkIfHandlerReferenceIsRegisteredInHandlerSet", [
		"HANDLER_SET",
		function factory( HANDLER_SET ){
			return function checkIfHandlerReferenceIsRegisteredInHandlerSet( handlerReference ){
				return handlerReference in HANDLER_SET;
			};
		}
	] )

	.factory( "checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet", [
		"EVENT_HANDLER_SET",
		function factory( EVENT_HANDLER_SET ){
			return function checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet( 
				eventHandlerReference, 
				handlerReference 
			){
				return eventHandlerReference in EVENT_HANDLER_SET &&
					( function checkIfEventHandlerReferenceIsRegisteredInEachEventHandlerList( ){
						var eventHandlerList = EVENT_HANDLER_SET[ eventHandlerReference ];

						var eventHandlerListLength = eventHandlerList.length;
						
						var eventHandlerData = null;
						for( var index = 0; index < eventHandlerListLength; index++ ){
							eventHandlerData = eventHandlerList[ index ];
							
							if( eventHandlerData.reference == handlerReference ){
								return true;
							}
						}

						return false;
					} )( );
			};
		}
	] )

	.factory( "checkIfEventHandlerIsRegistered", [
		"HANDLER_SET",
		"EVENT_HANDLER_SET",
		function factory( HANDLER_SET, EVENT_HANDLER_SET ){

		}
	] )

	.factory( "checkIfHandlerIsRegistered", [
		"checkIfHandlerReferenceIsRegisteredInHandlerSet",
		"checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet",
		"checkIfEventHandlerIsRegistered",
		function factory( 
			checkIfHandlerReferenceIsRegisteredInHandlerSet, 
			checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet,
			checkIfEventHandlerIsRegistered
		){
			return function checkIfHandlerIsRegistered( handler ){
				if( typeof handler == "string" ){
					if( checkIfHandlerReferenceIsRegisteredInHandlerSet( handler ) ){
						return true;

					}else{
						return checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet( handler );
					}

				}else{
					return checkIfEventHandlerIsRegistered( handler );
				}
			}
		}
	] )

	.factory( "getHandlerSet", [
		"HANDLER_SET",
		function factory( HANDLER_SET ){
			return function getHandlerSet( ){
				var handlerSet = { };
				
				for( var key in HANDLER_SET ){
					handlerSet[ key ] = HANDLER_SET[ key ];
				}

				return handlerSet;
			};
		}
	] )

	.factory( "getEventHandlerSet", [
		"EVENT_HANDLER_SET",
		function factory( EVENT_HANDLER_SET ){
			return function getEventHandlerSet( ){
				var eventHandlerSet = { };

				for( var key in EVENT_HANDLER_SET ){
					eventHandlerSet[ key ] = EVENT_HANDLER_SET[ key ];
				}

				return eventHandlerSet;
			}
		}
	] )

	.factory( "registerEventHandlerInHandlerSet", [
		"checkIfHandlerIsRegistered",
		"HANDLER_SET",
		function factory( checkIfHandlerIsRegistered, HANDLER_SET ){
			return function registerEventHandlerInHandlerSet( handlerReference, eventHandler ){
				if( !checkIfHandlerIsRegistered( handlerReference ) ){
					HANDLER_SET[ handlerReference ] = eventHandler;
				}
			};
		}
	] )

	.factory( "registerEventHandlerInEventHandlerSet", [
		"checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet",
		"EVENT_HANDLER_SET",
		function factory( checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet, EVENT_HANDLER_SET ){
			return function registerEventHandlerInEventHandlerSet( handlerReference, eventHandlerReference, eventHandler ){
				if( !checkIfEventHandlerReferenceIsRegisteredInEventHandlerSet( eventHandlerReference, handlerReference ) ){
					var eventHandlerList = EVENT_HANDLER_SET[ eventHandlerReference ] || [ ];

					eventHandlerList.push( {
						"reference": handlerReference,
						"handler": eventHandler
					} );

					EVENT_HANDLER_SET[ eventHandlerReference ] = eventHandlerList;
				}
			};
		}
	] )

	.factory( "registerEventHandler", [
		"registerEventHandlerInHandlerSet",
		"registerEventHandlerInEventHandlerSet",
		function factory( registerEventHandlerInHandlerSet, registerEventHandlerInEventHandlerSet ){
			return function registerEventHandler( handlerReference, eventHandlerReference, eventHandler ){
				registerEventHandlerInHandlerSet( handlerReference, eventHandler );
				registerEventHandlerInEventHandlerSet( handlerReference, eventHandlerReference, eventHandler );
			};
		}
	] )
	.factory( "isHandlerRegistered", [
		"checkIfHandlerIsRegistered",
		function factory( checkIfHandlerIsRegistered ){
			return function isHandlerRegistered( handler ){
				return checkIfHandlerIsRegistered( handler );
			};
		}
	] )
	.factory( "Event", [
		"isEventEngineRegistered",
		"registerEventEngine",
		"getEventEngineList",
		
		"isHandlerRegistered",
		"registerEventHandler",
		"getHandlerSet",
		"getEventHandlerSet",
		function factory( 
			isEventEngineRegistered,
			registerEventEngine,
			getEventEngineList,

			isHandlerRegistered,
			registerEventHandler, 
			getHandlerSet, 
			getEventHandlerSet 
		){
			var Event = function Event( eventEngine ){
				if( this instanceof Event ){
					this.eventEngine = eventEngine;

					this.registerEventEngine( this.eventEngine );

				}else{
					return new Event( eventEngine );
				}
			};

			Event.prototype.eventEngine = null;

			Event.prototype.broadcast = function broadcast( eventHandlerReference, eventParameterList ){
				this.eventEngine.$root.$broadcast.apply( this.eventEngine.$root, _.toArray( arguments ) );

				return this;
			};

			Event.prototype.emit = function emit( eventHandlerReference, eventParameterList ){
				this.eventEngine.$emit.apply( this.eventEngine, _.toArray( arguments ) );

				return this;
			};

			/*:
				Handler reference is used to refer to only the single handler instance.
			*/
			Event.prototype.on = function on( handlerReference, eventHandlerReference, eventHandler ){
				var parameterList = _.toArray( arguments );

				if( parameterList.length == 3 ){
					handlerReference = parameterList[ 0 ];

					parameterList = _.rest( parameterList );
				}

				eventHandlerReference = parameterList[ 0 ];
				eventHandler = parameterList[ 1 ];

				var handler = this.eventEngine.$on
					.call( this.eventEngine, eventHandlerReference,
						function delegateHandler( event ){
							var parameterList = _.toArray( arguments );

							parameterList = _.rest( parameterList );

							//: Place the event parameter last, we need it least.
							parameterList.push( event );
							
							eventHandler.apply( this.eventEngine, parameterList );	
						} );

				this.subscribeToPublicNotification.apply( this, parameterList );

				return this;
			};

			Event.prototype.subscribeToPublicNotification = function subscribeToPublicNotification( eventHandlerReference, eventHandler ){
				var eventNamespace = [ "public-notify", eventHandlerReference ].join( ":" );
				
				this.subscribe( eventNamespace,
					function publicNotifyHandler( ){
						//: @todo: Support internal handler scope environment passing.
						eventHandler.apply( this, _.toArray( arguments ) );
					} );
			};

			Event.prototype.notify = function notify( eventHandlerReference, eventParameterList ){
				this.eventEngine.$broadcast.apply( this.eventEngine, _.toArray( arguments ) );

				return this;
			};

			Event.prototype.publish = function publish( eventHandlerReference, eventParameterList ){
				var parameterList = _.toArray( arguments );

				pubsub.publish.apply( pubsub, parameterList );

				var eventNamespace = [ "public-notify", eventHandlerReference ].join( ":" );

				pubsub.publish.apply( pubsub, [ eventNamespace ].concat( _.rest( parameterList ) ) );

				return this;
			};

			Event.prototype.subscribe = function subscribe( eventHandlerReference, eventParameterList ){
				pubsub.subscribe.apply( pubsub, _.toArray( arguments ) );

				return this;
			};

			Event.prototype.subscribeOnce = function subscribeOnce( eventHandlerReference, eventParameterList ){
				pubsub.subscribeOnce.apply( pubsub, _.toArray( arguments ) );

				return this;
			};

			Event.prototype.unsubscribe = function unsubscribe( subscription ){
				pubsub.unsubscribe.apply( pubsub, _.toArray( arguments ) );

				return this;
			};

			/*Event.prototype.drop = function drop( handlerReference ){
				this.handlerSet[ handlerReference ]( );

				delete this.handlerSet[ handlerReference ];

				var eventHandlerData = null;
				for( var eventReference in this.eventHandlerSet ){
					var eventHandlerList = this.eventHandlerSet[ eventReference ];

					var eventHandlerListLength = eventHandlerList.length;

					for( var index = 0; index < eventHandlerListLength; index++ ){
						eventHandlerData = eventHandlerList[ index ];

						if( eventHandlerData.reference == handlerReference ){
							eventHandlerList.splice( index, 1 );

							return this;
						}
					}
				}

				return this;
			};

			Event.prototype.dropAll = function dropAll( eventHandlerReference ){
				var eventHandlerList = this.eventHandlerSet[ eventName ];

				var eventHandlerListLength = eventHandlerList.length;

				var eventHandlerData = null;
				
				while(
					eventHandlerData = eventHandlerList.pop( ),
					
					eventHandlerData.handler( ),
					
					delete this.handlerSet[ eventHandlerData.reference ],
					
					eventHandlerList.length;
				);

				return this;
			};

			Event.prototype.dropHandler = function dropEventHandler( eventHandler ){

			};*/

			Event.prototype.registerEventEngine = function registerEventEngine( eventEngine ){
				if( isEventEngineRegistered( eventEngine ) ){
					return this;
				}

				var self = this;

				eventEngine.broadcast = function broadcast( eventHandlerReference, eventParameterList ){
					self.broadcast.apply( self, _.toArray( arguments ) );

					return eventEngine;
				};

				eventEngine.emit = function emit( eventHandlerReference, eventParameterList ){
					self.emit.apply( self, _.toArray( arguments ) );

					return eventEngine;
				};

				eventEngine.on = function on( eventHandlerReference, eventHandler ){
					self.on.call( self, eventHandlerReference, eventHandler );

					return eventEngine;
				};

				/*eventEngine.drop = function drop( handlerReference ){
					self.drop.call( self, handlerReference );

					return eventEngine;
				};

				eventEngine.dropAll = function dropAll( eventHandlerReference ){
					self.dropAll.call( self, eventHandlerReference );

					return eventEngine;
				};

				eventEngine.dropEventHandler = function dropEventHandler( eventHandler ){
					self.dropEventHandler.call( self, eventHandler );

					return eventEngine;
				};*/

				eventEngine.notify = function notify( eventHandlerReference, eventParameterList ){
					self.notify.apply( self, _.toArray( arguments ) );

					return eventEngine;
				};

				eventEngine.publish = function publish( eventHandlerReference, eventParameterList ){
					self.publish.apply( self, _.toArray( arguments ) );

					return eventEngine;
				};

				eventEngine.subscribe = function subscribe( eventHandlerReference, eventHandler ){
					self.subscribe.call( self, eventHandlerReference, eventHandler );

					return eventEngine;
				};

				eventEngine.subscribeOnce = function subscribeOnce( eventHandlerReference, eventHandler ){
					self.subscribeOnce.apply( self, _.toArray( arguments ) );

					return eventEngine;
				};

				eventEngine.unsubscribe = function unsubscribe( eventHandler ){
					self.unsubscribe.call( self, eventHandler );

					return eventEngine;
				};

				return this;
			};

			return Event;
		}
	] );