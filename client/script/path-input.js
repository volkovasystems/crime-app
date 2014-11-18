angular.module( "PathInput", [ ] )
	.factory( "PathInput", [
		function factory( ){
			var PathInput = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"pathInput": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"titleName": "path",
						"title": "path",
						"parent": null,
						"pathInput": ""
					};
				},

				"onChangeNameInput": function onChangePathInput( event ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var pathInput = event.target.value;

					this.setState( {
						"pathInput": pathInput
					} );

					if( _.isEmpty( pathInput ) ){
						return this;
					}

					var titleName = this.props.titleName;

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						var stateData = { };

						stateData[ titleName ] = pathInput;

						self.parent.setState( stateData );

						clearTimeout( self.timeout );

						self.timeout = null;
					}, 100 );
				},

				"componentWillMount": function componentWillMount( ){
					this.parent = this.props.parent;
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var title = this.props.title;

					var pathInput = this.state.pathInput;

					var titleName = this.props.titleName;

					return (
						<div
							className={ [
								"path-input-component"
							].join( " " ) }
							style={
								{
									"position": "relative",
									
									"width": "inherit",
									"height": "auto",
									
									"color": "inherit",
									"fontSize": "inherit",
									"fontFamily": "inherit"
								}
							}>
							<label 
								htmlFor={ titleName }
								style={
									{
										"display": "block",
										"width": "inherit"
									}
								}>
								{ title.toUpperCase( ) }
							</label>
							<input
								id={ titleName }
								type="text"
								value={ pathInput }
								onChange={ this.onChangePathInput }
								style={
									{
										"width": "inherit",
										"fontSize": "25px"
									}
								} />
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevProps.pathInput != this.props.pathInput ){
						this.setState( {
							"pathInput": this.props.pathInput
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return PathInput;
		}
	] );