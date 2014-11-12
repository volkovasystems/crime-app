angular.module( "DescriptionInput", [ ] )
	.factory( "DescriptionInput", [
		function factory( ){
			var DescriptionInput = React.createClass( {
				"statics": {
					"attach": function attach( scope, container ){

					}
				},

				"getInitialState": function getInitialState( ){
					return {
						"descriptionInput": ""
					};
				},

				"getDefaultProps": function getDefaultProps( ){
					return {
						"descriptionName": "description",
						"title": "description",
						"parent": null
					};
				},

				"onChangeDescriptionInput": function onChangeDescriptionInput( event ){
					if( this.timeout ){
						clearTimeout( this.timeout );

						this.timeout = null;
					}

					var descriptionInput = event.target.value;

					this.setState( {
						"descriptionInput": descriptionInput
					} );

					if( _.isEmpty( descriptionInput ) ){
						return this;
					}

					var descriptionName = this.props.descriptionName;

					var self = this;

					this.timeout = setTimeout( function onTimeout( ){
						var stateData = { };

						stateData[ descriptionName ] = descriptionInput;

						self.parent.setState( stateData );

						clearTimeout( self.timeout );

						self.timeout = null;
					}, 500 );
				},

				"componentWillMount": function componentWillMount( ){
					this.parent = this.props.parent;
				},

				"componentWillUpdate": function componentWillUpdate( nextProps, nextState ){

				},

				"render": function onRender( ){
					var title = this.props.title;

					var descriptionInput = this.state.descriptionInput;

					var descriptionName = this.props.descriptionName;

					return (
						<div
							className={ [
								"description-input-component"
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
								htmlFor={ descriptionName }
								style={
									{
										"display": "block",
										"width": "inherit"
									}
								}>
								{ title.toUpperCase( ) }
							</label>
							<textarea
								id={ descriptionName }
								value={ descriptionInput }
								onChange={ this.onChangeDescriptionInput }
								rows="5"
								style={
									{
										"resize": "none",
										"width": "inherit",
										"fontSize": "25px"
									}
								}>
							</textarea>
						</div>
					);
				},

				"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
					if( prevProps.descriptionInput != this.props.descriptionInput ){
						this.setState( {
							"descriptionInput": this.props.descriptionInput
						} );
					}
				},

				"componentDidMount": function componentDidMount( ){

				}
			} );

			return DescriptionInput;
		}
	] );