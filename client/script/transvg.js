angular.module( "Transvg", [ ] )
	
	.factory( "Transvg", [
		function factory( ){
			/*:
				There are many ways to transform the svg whether they are a group of svg
					or just a single svg element.

				The svg may be a string or a jquery instance. Or a pure element.

				Regardless we will parse them all.
			*/
			var Transvg = function Transvg( svgElement ){
				if( this instanceof Transvg ){
					this.parseSVG( svgElement );

				}else{
					return new Transvg( svgElement );
				}
			};

			Transvg.prototype.svgElementList = [ ];

			Transvg.prototype.parseSVG = function parseSVG( svgElement ){
				/*:
					Since array push accepts multiple arguments,
						and I'm tired of using splice.

					We need to do this to preserve svgElementList instance.
				*/
				Array.prototype.push.apply( this.svgElementList,
					_.flatten( [ this.parseSVGElement( svgElement ) ] ) );

				var self = this;
				_.each( this.svgElementList,
					function onEachSVGElement( svgElement ){
						self.parsePathElement( svgElement );
					} );
			};

			Transvg.prototype.parseSVGElement = function parseSVGElement( svgElement ){
				if( typeof svgElement == "string" ){
					svgElement = $( svgElement );
				}

				if( !( svgElement instanceof jQuery ) ){
					svgElement = $( svgElement );
				} 

				var svgElementList = [ ];
				//: Check now if it still have svg inside. If so then this is a group.
				if( $( "svg", svgElement ).length ){
					$( "svg", svgElement ).each( function onEachSVGElement( ){
						svgElementList.push( $( this ) );
					} );

				}else{
					svgElementList.push( svgElement );
				}

				svgElementList = _.filter( svgElementList,
					function onEachSVGElement( svgElement ){
						return (
							!_.isEmpty( svgElement.attr( "width" ) ) &&
							!_.isEmpty( svgElement.attr( "height" ) ) &&
							!_.isEmpty( svgElement.attr( "id" ) ) &&
							$( "path", svgElement ).length > 0
						);
					} );

				_.each( svgElementList,
					function onEachSVGElement( svgElement ){
						svgElement.data( "width", svgElement.attr( "width" ) );

						svgElement.data( "height", svgElement.attr( "height" ) );

						svgElement.data( "id", svgElement.attr( "id" ) );
					} );

				return svgElementList;
			};

			Transvg.prototype.parsePathElement = function parsePathElement( svgElement ){
				var pathList = [ ];
				
				$( "path", svgElement ).each( function onEachPath( ){
					var pathElement = $( this );

					pathList.push( {
						"path": pathElement.attr( "d" ),
						"strokeColor": pathElement.attr( "stroke" ),
						"strokeWeight": pathElement.attr( "stroke-width" ),
						"fillColor": pathElement.attr( "fill" ) || "#000000",
						"fillOpacity": parseInt( pathElement.attr( "fill-opacity" ) || "0" ) || 1
					} );
				} );

				svgElement.data( "pathList", pathList );
			};

			Transvg.prototype.getPathDataList = function getPathDataList( reference ){
				var svgElement = _.find( this.svgElementList,
					function onEachSVGElement( svgElement ){
						return svgElement.data( "id" ) == reference;
					} );

				return svgElement.data( "pathList" );
			};

			return Transvg;
		}
	] );