Crime
	.directive( "caseCategoryListController", [
		"Event",
		"ProgressBar",
		function directive( 
			Event, 
			ProgressBar
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.on( "show-case-category-list",
						function onShowCaseCategoryList( ){
							scope.publish( "set-case-category-list",
								[
									{
										"name": "abuse-of-women",
										"title": "abuse of women",
										"source": ""
									},
									{
										"name": "child-abuse",
										"title": "child abuse",
										"source": ""
									},
									{
										"name": "arson",
										"title": "arson",
										"source": ""
									},
									{
										"name": "bribery",
										"title": "bribery",
										"source": ""
									},
									{
										"name": "burglary",
										"title": "burglary",
										"source": ""
									},
									{
										"name": "carnapping",
										"title": "carnapping",
										"source": ""
									},
									{
										"name": "child-labor",
										"title": "child labor",
										"source": ""
									},
									{
										"name": "domestic-violence",
										"title": "domestic violence",
										"source": ""
									},
									{
										"name": "extortion",
										"title": "extortion",
										"source": ""
									},
									{
										"name": "holdup",
										"title": "holdup",
										"source": ""
									},
									{
										"name": "robbery",
										"title": "robbery",
										"source": ""
									},
									{
										"name": "homicide",
										"title": "homicide",
										"source": ""
									},
									{
										"name": "illegal-drugs",
										"title": "illegal drugs",
										"source": ""
									},
									{
										"name": "illegal-logging",
										"title": "illegal logging",
										"source": ""
									},
									{
										"name": "illegal-fishing",
										"title": "illegal fishing",
										"source": ""
									},
									{
										"name": "kidnapping",
										"title": "kidnapping",
										"source": ""
									},
									{
										"name": "murder",
										"title": "murder",
										"source": ""
									},
									{
										"name": "physical-injury",
										"title": "physical injury",
										"source": ""
									},
									{
										"name": "pickpocketing",
										"title": "pickpocketing",
										"source": ""
									},
									{
										"name": "piracy",
										"title": "piracy",
										"source": ""
									},
									{
										"name": "prostitution",
										"title": "prostitution",
										"source": ""
									},
									{
										"name": "human-trafficking",
										"title": "human trafficking",
										"source": ""
									},
									{
										"name": "rape",
										"title": "rape",
										"source": ""
									},
									{
										"name": "smoke-belching",
										"title": "smoke belching",
										"source": ""
									},
									{
										"name": "theft",
										"title": "theft",
										"source": ""
									},
									{
										"name": "traffic-related",
										"title": "traffic related",
										"source": ""
									},	
									{
										"name": "vandalism",
										"title": "vandalism",
										"source": ""
									},
									{
										"name": "others",
										"title": "others",
										"source": ""
									}
								] );
						} );

					var selectedCaseCategoryData = {
						"getCallback": function getCallback( ){
							return this.callback || function callback( ){ };
						}
					};

					scope.on( "select-from-case-category-list",
						function onSelectFromCaseCategoryList( callback ){
							scope.publish( "show-case-category-list" );

							selectedCaseCategoryData.callback = callback;
						} );

					scope.on( "selected-case-category-changed",
						function onSelectedCaseCategoryChanged( selectedCaseCategory ){
							if( selectedCaseCategory.length > 1 ){
								scope.publish( "set-selected-case-category", [ _.last( selectedCaseCategory ) ] );

								return;
							}

							if( !_.isEmpty( selectedCaseCategory ) &&
								selectedCaseCategoryData.caseCategory != selectedCaseCategory[ 0 ] )
							{
								selectedCaseCategoryData.caseCategory = selectedCaseCategory[ 0 ];
							
							}else if( _.isEmpty( selectedCaseCategory ) ){
								selectedCaseCategoryData.caseCategory = null;
							}
						} );

					scope.on( "control-click:crime-case-category-list-select",
						function onCaseCategoryListSelect( ){
							selectedCaseCategoryData.getCallback( )( null, selectedCaseCategoryData.caseCategory );

							scope.publish( "clear-selected-case-category" );

							scope.publish( "hide-case-category-list" );
						} );

					scope.on( "control-click:crime-case-category-list-cancel",
						function onCaseCategoryListCancel( ){
							selectedCaseCategoryData.getCallback( )( "selection-cancelled" );

							scope.publish( "clear-selected-case-category" );

							scope.publish( "hide-case-category-list" );
						} );

					scope.on( "show-case-category-list",
						function onShowReport( ){
							scope.publish( "set-hidden-control-list", [ "crime-report" ] );

							scope.publish( "set-control-list",
								[
									{
										"reference": "crime-case-category-list",
										"name": "case-category-list-control-group",
										"isSeparateGroup": true,
										"controlList": [
											{
												"reference": "crime-case-category-list",
												"name": "crime-case-category-list-cancel",
												"title": "cancel",
												"icon": "ic_cancel_24px"
											},
											{
												"reference": "crime-case-category-list",
												"name": "crime-case-category-list-select",
												"title": "select",
												"icon": "ic_done_24px"
											}
										]
									}
								], true );
							
							scope.publish( "show-control" );
						} );

					scope.on( "hide-case-category-list",
						function onHideCaseCategoryList( ){
							scope.publish( "set-hidden-control-list", [ "!crime-report" ] );

							scope.publish( "remove-control", "crime-case-category-list" );
						} );
				}
			}
		}
	] );