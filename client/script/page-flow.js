angular.module( "PageFlow", [ "Event" ] )
	.constant( "PAGE_LIST", [ ] )
	.factory( "checkIfPageIsRegisteredInPageList", [
		"PAGE_LIST",
		function factory( PAGE_LIST ){
			return function checkIfPageIsRegisteredInPageList( page ){
				return _.contains( PAGE_LIST, page );
			};
		}
	] )
	.factory( "isPageRegistered", [
		"PAGE_LIST",
		"checkIfPageIsRegisteredInPageList",
		function factory( PAGE_LIST, checkIfPageIsRegisteredInPageList ){
			/*:
				This is just a delegate of checkIfPageIsRegisteredInPageList
			*/
			return function isPageRegistered( page ){
				return checkIfPageIsRegisteredInPageList( page );
			};
		}
	] )
	.factory( "registerPageInPageList", [
		"PAGE_LIST",
		"checkIfPageIsRegisteredInPageList",
		function factory( PAGE_LIST, checkIfPageIsRegisteredInPageList ){
			return function registerPageInPageList( page ){
				if( !checkIfPageIsRegisteredInPageList( page ) ){
					PAGE_LIST.push( page );	
				}
			};
		}
	] )
	.factory( "getPageList", [
		"PAGE_LIST",
		function factory( PAGE_LIST ){
			/*:
				This will clone the page list because we don't want the original array to be destroyed like
					being spliced or popped.
			*/
			return function getPageList( ){
				return PAGE_LIST.map( function onEachPage( page ){
					return page;
				} );
			};
		}
	] )
	.factory( "PageFlow", [
		"Event",
		"registerPageInPageList",
		"getPageList",
		"isPageRegistered",
		function factory( 
			Event, 
			registerPageInPageList, 
			getPageList,
			isPageRegistered
		){
			var PageFlow = function PageFlow( page, pageContainer, namespace ){
				if( this instanceof PageFlow ){
					if( typeof namespace == "string" && namespace ){
						this.namespaceList = this.namespaceList.concat( [ namespace ] );

						this.namespace = namespace;
					}
					
					this.registerPage( page, pageContainer );

				}else{
					return new PageFlow( page, pageContainer, namespace );
				}
			};

			/*:
				This is the main namespace to be used by the page.
			*/
			PageFlow.prototype.namespace = "";

			/*:
				Contain generally a page namespace. List all the default namespaces used by the page.
			*/
			PageFlow.prototype.namespaceList = [ "page" ];

			/*:
				Holds the page engine that manipulate the page.
			*/
			PageFlow.prototype.page = null;

			/*:
				Holds the DOM object of the page. 
			*/
			PageFlow.prototype.pageContainer = null;

			/*:
				List of current flow.
			*/
			PageFlow.prototype.flowList = [ ];

			/*:
				Get the overall namespace of this page.
			*/
			PageFlow.prototype.getNamespace = function getNamespace( ){
				return this.namespaceList.join( " " );
			};

			/*:
				Apply the specified flow list to the page.
			*/
			PageFlow.prototype.applyFlow = function applyFlow( flowList ){
				this.reflowDisabled = false;

				flowList = _.flatten( _.toArray( arguments ) );
				
				this.flowList = _.union( this.flowList, flowList, this.namespaceList );
				
				this.pageContainer.addClass( this.flowList.join( " " ) );

				return this;
			};

			/*:
				Remove all flow.
			*/
			PageFlow.prototype.clearFlow = function clearFlow( ){
				this.reflowDisabled = false;

				this.pageContainer.removeClass( this.flowList.join( " " ) );

				//: We don't want to destroy the original namespace list so we need to clone it.
				this.flowList = _.clone( this.namespaceList );

				this.applyFlow( );

				return this;
			};

			Object.defineProperty( PageFlow.prototype, "then",
				{
					"get": function get( ){
						this.reflowDisabled = true;

						return this;
					}
				} );

			/*:
				Remove all flow and apply new flow.
			*/
			PageFlow.prototype.reflow = function reflow( flowList ){
				if( this.reflowDisabled ){
					this.applyFlow.apply( this, _.toArray( arguments ) );

				}else{
					this.clearFlow( ).applyFlow.apply( this, _.toArray( arguments ) );	
				}

				return this;
			};

			/*:
				Remove the specified list of flow from this page without removing other flow and namespace.
			*/
			PageFlow.prototype.removeFlow = function removeFlow( flowList ){
				this.reflowDisabled = false;

				flowList = _.flatten( _.toArray( arguments ) );

				//: Remove the namespaces if it is in the flow list.
				flowList = _.without.apply( null, [ flowList ].concat( this.namespaceList ) );

				//: Remove the flow list now from the current flow list.
				this.flowList = _.without.apply( null, [ this.flowList ].concat( flowList ) );

				//: Apply the changes.
				this.pageContainer.removeClass( flowList.join( " " ) );

				return this;
			};

			/*:
				Remove pattern based flow from the current flow list replacing by the new flow.
			*/
			PageFlow.prototype.toggleFlow = function toggleFlow( flowPatternList, flowList ){
				this.reflowDisabled = false;

				//: Get all flow that is not a pattern.
				flowList = _.flatten( _.toArray( arguments ) )
					.filter( function onEachFlow( flow ){
						return !S( flow ).endsWith( "*" ) && !S( flow ).startsWith( "!" );
					} );

				//: Get all flow that is a pattern an apply regular expression format.
				flowPatternList = new RegExp( _.flatten( _.toArray( arguments ) )
					.filter( function onEachFlow( flow ){
						flow = S( flow );

						return flow.endsWith( "*" ) || flow.startsWith( "!" );
					} )
					.map( function onEachFlowPattern( flowPattern ){
						flowPattern = flowPattern
							.replace( "*", "[^\\s]+" )
							.replace( "!", "" );

						return "(@pattern)".replace( "@pattern", flowPattern );
					} )
					.join( "|" ), "g" );

				//: Remove all the flow that matches the pattern.
				this.removeFlow( this.flowList.join( " " ).match( flowPatternList ) );

				//: Apply all flow that is not a pattern.
				this.applyFlow( flowList );

				return this;
			};

			PageFlow.prototype.hidePage = function hidePage( ){
				this.toggleFlow( "!shown", "hidden" );

				return this;
			};

			PageFlow.prototype.showPage = function showPage( ){
				this.toggleFlow( "!hidden", "shown" );

				return this;
			};

			PageFlow.prototype.hideOtherPage = function hideOtherPage( ){
				var self = this;

				getPageList( )
					.forEach( function onEachPage( page ){
						if( this.page !== page ){
							page.hidePage( );
						}
					} );

				return this;
			};

			PageFlow.prototype.hideAllPage = function hideAllPage( ){
				var self = this;

				getPageList( )
					.forEach( function onEachPage( page ){
						page.hidePage( );
					} );

				return this;
			};

			/*:
				Bind default page flow and this page flow instance method to the page engine.
			*/
			PageFlow.prototype.registerPage = function registerPage( page, pageContainer ){
				if( isPageRegistered( page ) ){
					return this;
				}
				
				//: Add the page to the global page list.
				registerPageInPageList( page );

				this.page = page;

				this.pageContainer = pageContainer;

				var self = this;

				this.page.applyFlow = function applyFlow( flowList ){
					PageFlow.prototype.applyFlow.apply( self, _.toArray( arguments ) );

					return self.page;
				};

				this.page.clearFlow = function clearFlow( ){
					PageFlow.prototype.clearFlow.apply( self );

					return self.page;
				};

				Object.defineProperty( this.page, "then",
					{
						"get": function get( ){
							self.reflowDisabled = true;
							
							return self.page;
						}
					} );

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

				this.page.showPage = function showPage( ){
					PageFlow.prototype.showPage.apply( self );

					return self.page;
				};

				this.page.hidePage = function hidePage( ){
					PageFlow.prototype.hidePage.apply( self );

					return self.page;
				};

				this.page.hideAllPage = function hideAllPage( ){
					PageFlow.prototype.hideAllPage.apply( self );

					return self.page;
				};

				this.page.hideOtherPage = function hideOtherPage( ){
					PageFlow.prototype.hideOtherPage.apply( self );

					return self.page;
				};

				this.page.halfPage = function halfPage( ){
					self.reflow( "half-page" );

					return self.page;
				};

				this.page.halfPageRight = function halfPageRight( ){
					self.reflow( "half-page-right" );

					return self.page;
				};

				this.page.moveHalfPageRight = function moveHalfPageRight( ){
					self.reflow( "half-page", "half-page-right" );

					return self.page;
				};

				this.page.halfPageLeft = function halfPageLeft( ){
					self.reflow( "half-page-left" );

					return self.page;
				};

				this.page.moveHalfPageLeft = function moveHalfPageLeft( ){
					self.reflow( "half-page", "half-page-left" );

					return self.page;
				};

				this.page.wholePage = function wholePage( ){
					self.reflow( "whole-page" );

					return self.page;
				};

				this.page.wholePageCenter = function wholePageCenter( ){
					self.reflow( "whole-page-center" );

					return self.page;
				};

				this.page.moveWholePageCenter = function moveWholePageCenter( ){
					self.reflow( "whole-page", "whole-page-center" );

					return self.page;
				};

				this.page.wholePageLeft = function wholePageLeft( ){
					self.reflow( "whole-page-left" );

					return self.page;
				};

				this.page.moveWholePageLeft = function moveWholePageLeft( ){
					self.reflow( "whole-page", "whole-page-left" );

					return self.page;
				};

				this.page.wholePageRight = function wholePageRight( ){
					self.reflow( "whole-page-right" );

					return self.page;
				};

				this.page.moveWholePageRight = function moveWholePageRight( ){
					self.reflow( "whole-page", "whole-page-right" );

					return self.page;
				};

				this.page.wholePageUp = function wholePageUp( ){
					self.reflow( "whole-page-up" );

					return self.page;
				};

				this.page.moveWholePageUp = function moveWholePageUp( ){
					self.reflow( "whole-page", "whole-page-up" );

					return self.page;
				};

				this.page.wholePageDown = function wholePageDown( ){
					self.reflow( "whole-page-down" );

					return self.page;
				};

				this.page.moveWholePageDown = function moveWholePageDown( ){
					self.reflow( "whole-page", "whole-page-down" );

					return self.page;
				};

				return this;
			};

			return PageFlow;
		}
	] );