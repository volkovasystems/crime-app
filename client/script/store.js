angular.module( "Store", [ ] )
	
	.constant( "STORAGE", $.localStorage( ) )

	.constant( "STORE_ENGINE_LIST", [ ] )

	.factory( "checkIfStoreEngineIsRegisteredInStoreEngineList", [
		"STORE_ENGINE_LIST",
		function factory( STORE_ENGINE_LIST ){
			return function checkIfStoreEngineIsRegisteredInStoreEngineList( storeEngine ){
				return _.contains( STORE_ENGINE_LIST, storeEngine );
			};
		}
	] )

	.factory( "registerStoreEngine", [
		"STORE_ENGINE_LIST",
		"checkIfStoreEngineIsRegisteredInStoreEngineList",
		function factory( STORE_ENGINE_LIST, checkIfStoreEngineIsRegisteredInStoreEngineList ){
			return function registerStoreEngine( storeEngine ){
				if( !checkIfStoreEngineIsRegisteredInStoreEngineList( storeEngine ) ){
					STORE_ENGINE_LIST.push( storeEngine );
				}
			};
		}
	] )

	.factory( "isStoreEngineRegistered", [
		"checkIfStoreEngineIsRegisteredInStoreEngineList",
		function factory( checkIfStoreEngineIsRegisteredInStoreEngineList ){
			return function isStoreEngineRegistered( storeEngine ){
				return checkIfStoreEngineIsRegisteredInStoreEngineList( storeEngine )
			}
		}
	] )

	.factory( "Store", [
		"STORAGE",
		"registerStoreEngine",
		"isStoreEngineRegistered",
		function factory( 
			STORAGE,
			registerStoreEngine,
			isStoreEngineRegistered
		){

			var Store = function Store( storeEngine ){
				if( this instanceof Store ){
					this.storeEngine = storeEngine;

					this.registerStore( storeEngine );

				}else{
					return new Store( storeEngine );
				}
			};

			Store.prototype.set = function set( key, value ){
				STORAGE.setItem( key, value );

				return this;
			};

			Store.prototype.get = function get( key ){
				return STORAGE.getItem( key );
			};

			Store.prototype.drop = function drop( key ){
				STORAGE.removeItem( key );

				return this;
			};

			Store.prototype.dropAll = function dropAll( ){
				STORAGE.clear( );

				return this;
			};

			Store.prototype.registerStore = function registerStore( storeEngine ){
				if( isStoreEngineRegistered( storeEngine ) ){
					return this;
				}

				registerStoreEngine( storeEngine );

				var self = this;

				storeEngine.storeValue = function storeValue( key, value ){
					self.set( key, value );

					return storeEngine
				};

				storeEngine.getStoredValue = function getStoredValue( key ){
					return self.get( key );
				};

				storeEngine.dropStoredValue = function dropStoredValue( key ){
					self.drop( key );

					return storeEngine;
				};

				storeEngine.dropAllStoredValue = function dropAllStoredValue( ){
					self.dropAll( );

					return storeEngine;
				};

				return this;
			};

			return Store;
		}
	] )