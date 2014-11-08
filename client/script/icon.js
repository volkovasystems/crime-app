angular.module( "Icon", [ ] )
	.factory( "Icon", [
		function factory( ){
			var Icon = React.createClass( {
				"statics": {
					"SVG_SOURCE_PATTERN": /\.svg$/,
					"PREFIX_DASH_PATTERN": /^-/,
					
					"defaultIconSymbolWidth": "34",
					"defaultIconSymbolHeight": "34",
					"defaultIconImage": "../image/empty.png",

					"svgElementSourceSet": { },

					/*:
						This will act as a preloader for all the icon sets that will be used.

						@note: This will only set the source list, a separate method should be called to fetch them.
					*/
					"setSourceList": function setSourceList( sourceList ){
						Icon.sourceList = sourceList;

						return Icon;
					},

					/*:
						This will fetch the icon sets based from the source list.
					*/
					"requestAllSVGElementFromSourceList": function requestAllSVGElementFromSourceList( callback ){
						var svgElementSourceSet = Icon.svgElementSourceSet;
						var sourceList = Icon.sourceList;

						sourceList.forEach( function onEachSourceURL( sourceURL ){
							$.get( sourceURL,
								function onResult( svgData ){
									var svgElementFromSource = $( svgData );
									
									svgElementSourceSet[ sourceURL ] = svgElementFromSource;

									if( _.values( svgElementSourceSet ).length == sourceList.length ){
										if( typeof callback == "function" ){
											callback( );
										}
									}
								} );
						} );

						return Icon;
					},

					"searchSourceBasedFromSVGElementName": function searchSourceBasedFromSVGElementName( svgElementName ){
						return _( Icon.svgElementSourceSet )
							.map( function onEachSVGElementSource( svgElementSource, sourceURL ){
								var selectorID = [ "#", svgElementName ].join( "" );
								
								if( $( selectorID, svgElementSource ).length == 1 ){
									return sourceURL;

								}else{
									return null;
								}
							} )
							.compact( )
							.value( )[ 0 ];
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"classList": [ ],

						"sourceURL": "",

						"svgElementFromSource": null,
						"svgElement": null,
						"svgSourceState": "svg-standby",

						"rawSVGElement": "",

						"sourceState": "image-source"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"style": { },
						"className": "",
						"width": this.defaultIconSymbolWidth,
						"height": this.defaultIconSymbolHeight,
						"src": this.defaultIconImage,
					};
				},

				"getWidth": function getWidth( props ){
					props = props || this.props;

					return props.width || props.style.width;
				},

				"getHeight": function getHeight( props ){
					props = props || this.props;

					return props.height || props.style.height;
				},

				"getDimension": function getDimension( props ){
					return {
						"width": this.getWidth( props ),
						"height": this.getHeight( props )
					};
				},

				"getName": function getName( ){
					return this.props.name || this.classList[ 0 ];
				},

				"getSVGNamespace": function getSVGNamespace( ){
					var prefix = this.props.prefix || "";

					var name = this.getName( );

					return [ prefix, name ].join( "-" ).replace( Icon.PREFIX_DASH_PATTERN, "" );
				},

				"determineSource": function determineSource( sourceURL ){
					if( this.checkIfSVGSource( sourceURL ) ){
						this.setState( {
							"sourceState": "svg-source"
						} );

					}else{
						this.setState( {
							"sourceState": "image-source"
						} );
					}
				},

				"checkIfSVGSource": function checkIfSVGSource( sourceURL ){
					return Icon.SVG_SOURCE_PATTERN.test( sourceURL );
				},

				"getSVGFromSource": function getSVGFromSource( sourceURL ){
					var svgElementSourceSet = Icon.svgElementSourceSet;

					var self = this;

					if( sourceURL in svgElementSourceSet ){
						this.setState( {
							"svgElementFromSource": svgElementSourceSet[ sourceURL ]
						} );

					}else{
						$.get( sourceURL,
							function onResult( svgData ){
								var svgElementFromSource = $( svgData );
								
								svgElementSourceSet[ sourceURL ] = svgElementFromSource;

								self.setState( {
									"svgElementFromSource": svgElementFromSource
								} );
							} );	
					}
				},

				"buildClassList": function buildClassList( className ){
					this.setState( {
						"classList": className.split( " " )
					} );
				},

				"determineSVGElement": function determineSVGElement( svgElementFromSource ){
					var svgNamespace = this.getSVGNamespace( );

					var selectorID = [ "#", svgNamespace ].join( "" );

					if( svgElementFromSource.attr( "id" ) == svgNamespace ){
						this.setState( {
							"svgElement": svgElementFromSource
						} );

					}else{
						this.setState( {
							"svgElement": $( selectorID, svgElementFromSource )
						} );	
					}
				},

				"applyStyleSetToSVGElement": function applyStyleSetToSVGElement( styleSet, svgElement ){
					svgElement = svgElement || this.state.svgElement;

					var svgElementStyleSet = {
						"position": "absolute",
						"top": "50%",
						"left": "50%",
						"transform": "translateX(-50%) translateY(-50%)"
					};

					_.extend( svgElementStyleSet, styleSet )

					svgElement.css( svgElementStyleSet );
				},

				"addXMLNamespaceToSVGElement": function addXMLNamespaceToSVGElement( svgElement ){
					var parentWithXMLNamespace = svgElement.parents( "svg[xmlns][xmlns\\:xlink]" );

					var xmlnsValue = parentWithXMLNamespace.attr( "xmlns" );
					var xmlnsXlinkValue = parentWithXMLNamespace.attr( "xmlns\:xlink" );

					svgElement.attr( {
						"xmlns": xmlnsValue,
						"xmlns\:xlink": xmlnsXlinkValue
					} );
				},

				"adjustSVGDimension": function adjustSVGDimension( dimension ){
					var svgElement = this.state.svgElement;

					var attributeSet = {
						"x": "0",
						"y": "0"
					};

					_.extend( attributeSet, dimension );

					svgElement.attr( attributeSet );
				},

				"attachSVGElement": function attachSVGElement( svgElement ){
					this.setState( {
						"rawSVGElement": svgElement.wrap( "<div>" ).parent( ).html( ),
						"svgSourceState": "svg-ready"
					} );
				},

				"componentWillMount": function componentWillMount( ){
					
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var sourceState = this.state.sourceState;

					var svgSourceState = this.state.svgSourceState;

					var rawSVGElement = this.state.rawSVGElement;

					return ( 
						<div
							className={ 
								this.state.classList.join( " " ) 
							}
							style={
								{
									"overflow": "hidden",
									"width": "inherit",
									"height": "inherit"
								}
							}>

							<img 
								src={ this.props.src }
								style={
									{
										"width": "inherit",
										"height": "inherit",
										"display": (
											sourceState == "svg-source" &&
											svgSourceState == "svg-ready"
										)? "none" : "block"
									}
								} />

							<div
								style={
									{
										"width": "inherit",
										"height": "inherit",
										"display": (
											sourceState == "svg-source" &&
											svgSourceState == "svg-ready"
										)? "block" : "none"
									}
								}
								dangerouslySetInnerHTML={
									{ 
										"__html": rawSVGElement
									}
								}>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevState.sourceURL != this.state.sourceURL ){
						this.determineSource( this.state.sourceURL );
					}

					if( prevProps.className != this.props.className ){
						this.buildClassList( this.props.className );
					}

					if( prevState.sourceState != this.state.sourceState &&
						this.state.sourceState == "svg-source" )
					{
						this.getSVGFromSource( this.state.sourceURL || this.props.src );
					}

					if( !_.isEqual( prevState.svgElementFromSource, this.state.svgElementFromSource ) ){
						this.determineSVGElement( this.state.svgElementFromSource );
					}

					if( !_.isEqual( prevState.svgElement, this.state.svgElement ) ){
						this.addXMLNamespaceToSVGElement( this.state.svgElement );

						this.applyStyleSetToSVGElement( this.props.style, this.state.svgElement );

						this.adjustSVGDimension( this.getDimension( ) );

						this.attachSVGElement( this.state.svgElement );
					}

					if( !_.isEqual( prevProps.style, this.props.style ) &&
						this.state.svgSourceState == "svg-ready" )
					{
						this.applyStyleSetToSVGElement( this.props.style );

						this.attachSVGElement( this.state.svgElement );
					}

					if( !_.isEqual( this.getDimension( prevProps ), this.getDimension( ) ) &&
						this.state.svgSourceState == "svg-ready" )
					{
						this.adjustSVGDimension( this.getDimension( ) );

						this.attachSVGElement( this.state.svgElement );
					}
				},

				"initiateSourceURLWatch": function initiateSourceURLWatch( ){
					if( "timeout" in this ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						if( self.props.src != Icon.defaultIconImage ){
							self.determineSource( this.props.src );

							clearTimeout( self.timeout );
							
							self.timeout = null;

						}else if( "name" in self.props ){
							var sourceURL = Icon.searchSourceBasedFromSVGElementName( self.props.name );

							if( _.isEmpty( sourceURL ) ){
								console.warn( "source url for the specified icon name was not found", self.props.name );

								self.initiateSourceURLWatch( );

							}else{
								self.setState( { 
									"sourceURL": sourceURL 
								}, function onStateChanged( ){
									clearTimeout( self.timeout );

									self.timeout = null;
								} );
							}
						}
					}, 1 );
				},

				"componentDidMount": function componentDidMount( ){
					this.initiateSourceURLWatch( );

					this.buildClassList( this.props.className );
				}
			} );

			return Icon;
		}
	] );