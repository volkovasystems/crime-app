angular.module( "TitleInput", [ ] )
	.factory( "TitleInput", [
		function factory( ){
			var TitleInput = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"titleInput": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"titleName": "title",
						"title": "title",
						"parent": null,
						"titleInput": ""
					};
				},

				"onChangeTitleInput": function onChangeTitleInput( event ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var titleInput = event.target.value;

					this.setState( {
						"titleInput": titleInput
					} );

					if( _.isEmpty( titleInput ) ){
						return this;
					}

					var titleName = this.props.titleName;

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						var stateData = { };

						stateData[ titleName ] = titleInput;

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

					var titleInput = this.state.titleInput;

					var titleName = this.props.titleName;

					return (
						<div
							className={ [
								"title-input-component"
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
								value={ titleInput }
								onChange={ this.onChangeTitleInput }
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
					if( prevProps.titleInput != this.props.titleInput ){
						this.setState( {
							"titleInput": this.props.titleInput
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return TitleInput;
		}
	] );