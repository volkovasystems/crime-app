angular.module( "NameInput", [ ] )
	.factory( "NameInput", [
		function factory( ){
			var NameInput = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"nameInput": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"titleName": "name",
						"title": "name",
						"parent": null,
						"nameInput": ""
					};
				},

				"onChangeNameInput": function onChangeNameInput( event ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var nameInput = event.target.value;

					this.setState( {
						"nameInput": nameInput
					} );

					if( _.isEmpty( nameInput ) ){
						return this;
					}

					var titleName = this.props.titleName;

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						var stateData = { };

						stateData[ titleName ] = nameInput;

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

					var nameInput = this.state.nameInput;

					var titleName = this.props.titleName;

					return (
						<div
							className={ [
								"name-input-component"
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
								value={ nameInput }
								onChange={ this.onChangeNameInput }
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
					if( prevProps.nameInput != this.props.nameInput ){
						this.setState( {
							"nameInput": this.props.nameInput
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return NameInput;
		}
	] );