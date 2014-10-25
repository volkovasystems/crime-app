var icon = React.createClass( {
	"statics": {
		"SVG_SOURCE_PATTERN": /\.svg$/,
		"PREFIX_DASH_PATTERN": /^-/,
		"svgElementSourceSet": { },
		"defaultIconSymbolWidth": "34",
		"defaultIconSymbolHeight": "34"
	},

	"getInitialState": function getInitialState( ){
		return {
			"classList": [ ],

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
			"src": "../image/empty.png",
		}
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

		return [ prefix, name ].join( "-" ).replace( icon.PREFIX_DASH_PATTERN, "" );
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
		return icon.SVG_SOURCE_PATTERN.test( sourceURL );
	},

	"getSVGFromSource": function getSVGFromSource( sourceURL ){
		var self = this;

		if( sourceURL in icon.svgElementSourceSet ){
			this.setState( {
				"svgElementFromSource": icon.svgElementSourceSet[ sourceURL ]
			} );

		}else{
			$.get( sourceURL,
				function onResult( svgData ){
					var svgElementFromSource = $( svgData );
					
					icon.svgElementSourceSet[ sourceURL ] = svgElementFromSource;

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
					ref="imageElement"
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
							"__html": this.state.rawSVGElement
						}
					}>
				</div>
			</div>
		);
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( prevProps.className != this.props.className ){
			this.buildClassList( this.props.className );
		}

		if( prevState.sourceState != this.state.sourceState &&
			this.state.sourceState == "svg-source" )
		{
			this.getSVGFromSource( this.props.src );
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

	"componentDidMount": function componentDidMount( ){
		this.determineSource( this.props.src );

		this.buildClassList( this.props.className );
	}
} );