Crime

	.factory( "getDefaultCaseCategoryList", [
		function factory( ){
			var getDefaultCaseCategoryList = function getDefaultCaseCategoryList( ){

			};

			return getDefaultCaseCategoryList;
		}
	] )

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
										"name": "women-abuse",
										"title": "Women Abuse",
										"source": "../image/women-abuse-marker.png"
									},
									{
										"name": "child-abuse",
										"title": "Child Abuse",
										"source": "../image/child-abuse-marker.png"
									},
									{
										"name": "arson",
										"title": "Arson",
										"source": "../image/arson-marker.png"
									},
									{
										"name": "bribery",
										"title": "Bribery",
										"source": "../image/bribery-marker.png"
									},
									{
										"name": "burglary",
										"title": "Burglary",
										"source": "../image/burglary-marker.png"
									},
									{
										"name": "carnapping",
										"title": "Carnapping",
										"source": "../image/carnapping-marker.png"
									},
									{
										"name": "child-labor",
										"title": "Child Labor",
										"source": "../image/child-labor-marker.png"
									},
									{
										"name": "domestic-violence",
										"title": "Domestic Violence",
										"source": "../image/domestic-violence-marker.png"
									},
									{
										"name": "extortion",
										"title": "Extortion",
										"source": "../image/extortion-marker.png"
									},
									{
										"name": "holdup",
										"title": "Holdup",
										"source": "../image/holdup-robbery-marker.png"
									},
									{
										"name": "robbery",
										"title": "Robbery",
										"source": "../image/holdup-robbery-marker.png"
									},
									{
										"name": "homicide",
										"title": "Homicide",
										"source": "../image/homicide-marker.png"
									},
									{
										"name": "illegal-drug",
										"title": "Illegal Drug",
										"source": "../image/illegal-drug-marker.png"
									},
									{
										"name": "illegal-logging",
										"title": "Illegal Logging",
										"source": "../image/illegal-logging-marker.png"
									},
									{
										"name": "illegal-fishing",
										"title": "Illegal Fishing",
										"source": "../image/illegal-fishing-marker.png"
									},
									{
										"name": "kidnapping",
										"title": "Kidnapping",
										"source": "../image/kidnapping-marker.png"
									},
									{
										"name": "murder",
										"title": "Murder",
										"source": "../image/murder-marker.png"
									},
									{
										"name": "physical-injury",
										"title": "Physical Injury",
										"source": "../image/physical-injury-marker.png"
									},
									{
										"name": "pickpocketing",
										"title": "Pickpocketing",
										"source": "../image/pickpocketing-marker.png"
									},
									{
										"name": "piracy",
										"title": "Piracy",
										"source": "../image/piracy-marker.png"
									},
									{
										"name": "prostitution",
										"title": "Prostitution",
										"source": "../image/prostitution-marker.png"
									},
									{
										"name": "human-trafficking",
										"title": "Human Trafficking",
										"source": "../image/human-trafficking-marker.png"
									},
									{
										"name": "rape",
										"title": "Rape",
										"source": "../image/rape-marker.png"
									},
									{
										"name": "smoke-belching",
										"title": "Smoke Belching",
										"source": "../image/smoke-belching-marker.png"
									},
									{
										"name": "theft",
										"title": "Theft",
										"source": "../image/theft-marker.png"
									},
									{
										"name": "traffic-violation",
										"title": "Traffic Violation",
										"source": "../image/traffic-violation-marker.png"
									},	
									{
										"name": "vandalism",
										"title": "Vandalism",
										"source": "../image/vandalism-marker.png"
									},
									{
										"name": "others",
										"title": "Others",
										"source": "../image/others-marker.png"
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

					scope.on( "back-case-category-list",
						function onBackCaseCategoryList( ){
							scope.publish( "clear-selected-case-category" );

							scope.publish( "hide-case-category-list" );
						} );
				}
			}
		}
	] );