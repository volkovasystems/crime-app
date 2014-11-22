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
										"source": "../image/child-abuse.svg"
									},
									{
										"name": "arson",
										"title": "arson",
										"source": "../image/arson.svg"
									},
									{
										"name": "bribery",
										"title": "bribery",
										"source": "../image/bribery.svg"
									},
									{
										"name": "burglary",
										"title": "burglary",
										"source": "../image/burglary.svg"
									},
									{
										"name": "carnapping",
										"title": "carnapping",
										"source": "../image/carnapping.svg"
									},
									{
										"name": "child-labor",
										"title": "child labor",
										"source": "../image/child-labor.svg"
									},
									{
										"name": "domestic-violence",
										"title": "domestic violence",
										"source": "../image/domestic-violence.svg"
									},
									{
										"name": "extortion",
										"title": "extortion",
										"source": "../image/extortion.svg"
									},
									{
										"name": "holdup",
										"title": "holdup",
										"source": "../image/holdup-robbery.svg"
									},
									{
										"name": "robbery",
										"title": "robbery",
										"source": "../image/holdup-robbery.svg"
									},
									{
										"name": "homicide",
										"title": "homicide",
										"source": "../image/homicide.svg"
									},
									{
										"name": "illegal-drug",
										"title": "illegal drug",
										"source": "../image/illegal-drug.svg"
									},
									{
										"name": "illegal-logging",
										"title": "illegal logging",
										"source": "../image/illegal-logging.svg"
									},
									{
										"name": "illegal-fishing",
										"title": "illegal fishing",
										"source": ""
									},
									{
										"name": "kidnapping",
										"title": "kidnapping",
										"source": "../image/kidnapping.svg"
									},
									{
										"name": "murder",
										"title": "murder",
										"source": "../image/murder.svg"
									},
									{
										"name": "physical-injury",
										"title": "physical injury",
										"source": "../image/physical-injury.svg"
									},
									{
										"name": "pickpocketing",
										"title": "pickpocketing",
										"source": "../image/pickpocketing.svg"
									},
									{
										"name": "piracy",
										"title": "piracy",
										"source": "../image/piracy.svg"
									},
									{
										"name": "prostitution",
										"title": "prostitution",
										"source": "../image/prostitution.svg"
									},
									{
										"name": "human-trafficking",
										"title": "human trafficking",
										"source": ""
									},
									{
										"name": "rape",
										"title": "rape",
										"source": "../image/rape.svg"
									},
									{
										"name": "smoke-belching",
										"title": "smoke belching",
										"source": "../image/smoke-belching.svg"
									},
									{
										"name": "theft",
										"title": "theft",
										"source": "../image/theft.svg"
									},
									{
										"name": "traffic-violation",
										"title": "traffic violation",
										"source": "../image/traffic-violation.svg"
									},	
									{
										"name": "vandalism",
										"title": "vandalism",
										"source": "../image/vandalism.svg"
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