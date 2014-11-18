angular.module( "ThumbnailList", [ "Icon" ] )

	.factory( "ThumbnailList", [
		"Icon",
		function factory( Icon ){
			var ThumbnailList = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){
						var thumbnailListComponent = ( 
							<ThumbnailList 
								scope={ scope } 
								container={ container } /> 
						);

						React.render( thumbnailListComponent, container[ 0 ] );

						return this;
					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"selectedThumbnailList": [ ],
						"thumbnailList": [ ],
						"thumbnailDimension": 0,
						"percentageGap": "",
						"thumbnailItemState": "thumbnail-item-hidden"
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"titleName": "thumbnailList",
						"title": "",
						"parent": null,
						"selectedThumbnailList": [ ],
						"thumbnailList": [ ]
					};
				},

				"onClickThumbnailItem": function onClickThumbnailItem( event ){
					var thumbnailName = $( event.currentTarget ).attr( "value" );

					var selectedThumbnailList = this.state.selectedThumbnailList.slice( 0 );

					selectedThumbnailList.push( thumbnailName );

					this.setState( {
						"selectedThumbnailList": selectedThumbnailList
					} );
				},

				"onEachThumbnail": function onEachThumbnail( thumbnailData, index ){
					var thumbnailName = thumbnailData.name;

					var thumbnailTitle = thumbnailData.title;

					var thumbnailDescription = thumbnailData.description;

					var thumbnailSource = thumbnailData.source;

					var thumbnailDimension = this.state.thumbnailDimension;

					var thumbnailItemState = this.state.thumbnailItemState;

					var isSelected = _.contains( this.state.selectedThumbnailList, thumbnailName );

					return (
						<li
							className={ [
								"thumbnail-item",
								( isSelected )? "selected" : ""
							].join( " " ) }
							style={
								{
									"position": "relative",

									"width": thumbnailDimension,
									"height": thumbnailDimension,

									"display": ( thumbnailItemState == "thumbnail-item-shown" ) ? "inline-block" : "none",

									"margin": "5px"
								}
							}
							onClick={ this.onClickThumbnailItem }
							value={ thumbnailName }>
							<div
								style={
									{
										"position": "absolute",
										
										"width": "inherit",
										"height": "inherit"
									}
								}>

								<Icon
									src={ thumbnailSource }
									name={ thumbnailName } />
								
								<div
									style={
										{
											"position": "absolute",
											
											"bottom": "0px",
											"left": "0px",

											"width": "inherit",
											"height": "auto"
										}
									}>
									<span
										style={
											{
												"position": "absolute",
												
												"bottom": "0px",
												"left": "50%",
												"transform": "translateX(-50%)",
												
												"width": "100%",
												
												"padding": "2px",
												
												"overflow": "hidden",
												
												"fontSize": "13px",

												"textAlign": "center",
												"textOverflow": "ellipsis",

												"letterSpacing": "1px"
											}
										}>
										{ thumbnailTitle.toUpperCase( ) }
									</span>
								</div>
							</div>
						</li>
					);
				},

				"adjustThumbnailDimension": function adjustThumbnailDimension( ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						var containerWidth = self.refs.thumbnailListComponent.getDOMNode( ).clientWidth;
						if( containerWidth ){
							var thumbnailDimension = math.sqrt( self.state.thumbnailList.length );

							var percentageGap = thumbnailDimension;

							var percentage = thumbnailDimension / 100;

							thumbnailDimension = containerWidth / thumbnailDimension;

							thumbnailDimension = thumbnailDimension + ( thumbnailDimension * percentage );

							self.setState( {
								"thumbnailDimension": thumbnailDimension,
								"percentageGap": percentageGap,
								"thumbnailItemState": "thumbnail-item-shown"
							} );

							clearTimeout( self.timeout );

							self.timeout = null;

						}else{
							self.adjustThumbnailDimension( );
						}
						
					}, 1000 );
				},

				"componentWillMount": function componentWillMount( ){
					this.parent = this.props.parent;
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var title = this.props.title;

					var thumbnailList = this.state.thumbnailList;

					var thumbnailDimension = this.state.thumbnailDimension;

					var percentageGap = this.state.percentageGap;

					return (
						<div
							ref="thumbnailListComponent"
							className={ [
								"thumbnail-list-component"
							].join( " " ) }
							style={
								{
									"position": "relative",
									
									"width": "inherit",
									"height": "100%",
									
									"color": "inherit",
									"fontSize": "inherit",
									"fontFamily": "inherit"
								}
							}>
							<label 
								style={
									{
										"display": ( _.isEmpty( title )? "none" : "block" ),
										
										"position": "relative",

										"width": "inherit",
										"height": "auto"
									}
								}>
								{ title.toUpperCase( ) }
							</label>

							<div
								className={ [
									"thumbnail-list-container"
								].join( " " ) }
								style={
									{
										"display": "block",
										
										"position": "relative",
										
										"width": "inherit",
										"height": "100%"
									}
								}>
								<ul
									className={ [
										"thumbnail-list"
									].join( " " ) }
									style={
										{
											"position": "absolute",
										
											"top": "0px",
											"left": "0px",
											"right": "0px",

											"width": "auto",
											"height": "auto",

											"paddingLeft": [ percentageGap, "%" ].join( "" ),
											"paddingRight": [ percentageGap, "%" ].join( "" ),
											"paddingTop": "0px",
											"paddingBottom": "0px",

											"marginLeft": "0px",
											"marginRight": [ "-", percentageGap, "%" ].join( "" ),
											"marginTop": "0px",
											"marginBottom": "0px"
										}
									}>
									{ thumbnailList.map( this.onEachThumbnail ) }
								</ul>
							</div>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( !_.isEqual( prevProps.thumbnailList, this.props.thumbnailList ) ){
						this.setState( {
							"thumbnailList": this.props.thumbnailList
						} );
					}

					if( !_.isEqual( prevState.thumbnailList, this.state.thumbnailList ) ){
						this.adjustThumbnailDimension( );
					}

					if( !_.isEqual( prevProps.selectedThumbnailList, this.props.selectedThumbnailList ) ){
						this.setState( {
							"selectedThumbnailList": this.props.selectedThumbnailList
						} );
					}

					if( !_.isEqual( prevState.selectedThumbnailList, this.state.selectedThumbnailList ) ){
						var stateData = { };

						stateData[ this.props.titleName ] = this.state.selectedThumbnailList;

						this.props.parent.setState( stateData );
					}
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return ThumbnailList;
		}
	] );