Crime

	.factory( "getDefaultCaseCategoryList", [
		function factory( ){
			var getDefaultCaseCategoryList = function getDefaultCaseCategoryList( ){
				return [
					{
						"name": "women-abuse",
						"title": "Women Abuse"
					},
					{
						"name": "child-abuse",
						"title": "Child Abuse"
					},
					{
						"name": "arson",
						"title": "Arson"
					},
					{
						"name": "bribery",
						"title": "Bribery"
					},
					{
						"name": "burglary",
						"title": "Burglary"
					},
					{
						"name": "carnapping",
						"title": "Carnapping"
					},
					{
						"name": "child-labor",
						"title": "Child Labor"
					},
					{
						"name": "domestic-violence",
						"title": "Domestic Violence"
					},
					{
						"name": "extortion",
						"title": "Extortion"
					},
					{
						"name": "holdup",
						"title": "Holdup"
					},
					{
						"name": "robbery",
						"title": "Robbery"
					},
					{
						"name": "homicide",
						"title": "Homicide"
					},
					{
						"name": "illegal-drug",
						"title": "Illegal Drug"
					},
					{
						"name": "illegal-logging",
						"title": "Illegal Logging"
					},
					{
						"name": "illegal-fishing",
						"title": "Illegal Fishing"
					},
					{
						"name": "kidnapping",
						"title": "Kidnapping"
					},
					{
						"name": "murder",
						"title": "Murder"
					},
					{
						"name": "physical-injury",
						"title": "Physical Injury"
					},
					{
						"name": "pickpocketing",
						"title": "Pickpocketing"
					},
					{
						"name": "piracy",
						"title": "Piracy"
					},
					{
						"name": "prostitution",
						"title": "Prostitution"
					},
					{
						"name": "human-trafficking",
						"title": "Human Trafficking"
					},
					{
						"name": "rape",
						"title": "Rape"
					},
					{
						"name": "smoke-belching",
						"title": "Smoke Belching"
					},
					{
						"name": "theft",
						"title": "Theft"
					},
					{
						"name": "traffic-violation",
						"title": "Traffic Violation"
					},	
					{
						"name": "vandalism",
						"title": "Vandalism"
					},
					{
						"name": "others",
						"title": "Others"
					}
				];
			};

			return getDefaultCaseCategoryList;
		}
	] )

	.directive( "caseCategoryListController", [
		"Event",
		"ProgressBar",
		"getDefaultCaseCategoryList",
		function directive( 
			Event, 
			ProgressBar,
			getDefaultCaseCategoryList
		){
			return {
				"restrict": "A",
				"scope": true,
				"priority": 1,
				"link": function onLink( scope, element, attributeSet ){
					ProgressBar( scope );

					Event( scope );

					scope.on( "show-case-category-list",
						function onShowCaseCategoryList( namespace ){
							if( scope.namespace == namespace ){
								scope.publish( "set-case-category-list", getDefaultCaseCategoryList( ) );	
							}
						} );
				}
			}
		}
	] );