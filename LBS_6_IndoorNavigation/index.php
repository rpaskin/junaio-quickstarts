<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 *  
 * @abstract	Using junaio with LLA Markers or other references for creating highly accurate indoor experiences
 * 				 				
 * 				Learnings:
 * 					- receive encoded lat, long, alt positions from the LLA markers
 * 					- manually override the users positions (deactivate the GPS)
 * 					- switching POIs visible on the fly
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';

//make sure to provide the lla marker tracking configuration
ArelXMLHelper::start(NULL, "arel/index.html", ArelXMLHelper::TRACKING_LLA_MARKER);

//first arrow
$arrowObject = ArelXMLHelper::createLocationBasedModel3D(
						"arrow1", //id
						"Arrow", //name
						"resources/arrow.zip", //model 
						"resources/arrow.png", //texture
						array(37.783248, -122.403244, 0), //location
						array(600, 600, 600), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57, 0, 2.37)) //rotation
				);

//set the poi invisible in liveview, mapview/listview and radar
$arrowObject->setVisibility(false, false, false);
//move the arrow a little down
$arrowObject->setTranslation(array(0,0,-1500));
ArelXMLHelper::outputObject($arrowObject);				

//second arrow
$arrowObject = ArelXMLHelper::createLocationBasedModel3D(
						"arrow2", //id
						"Arrow", //name
						"resources/arrow.zip", //model 
						"resources/arrow.png", //texture
						array(37.783212, -122.403192, 0), //location
						array(600, 600, 600), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57, 0, 2.37)) //rotation
				);

//set the poi invisible in liveview, mapview/listview and radar
$arrowObject->setVisibility(false, false, false);
//move the arrow a little down
$arrowObject->setTranslation(array(0,0,-1500));
ArelXMLHelper::outputObject($arrowObject);	

//1. Sound POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"conf1", //id
		"Conference Room 1", //title
		array(37.783294, -122.403299, 0), //location
		"resources/1.png", //thumb
		"resources/1.png", //icon
		"This is Conference Room 1 with many interesting sessions going on today.", //description
		array() //buttons
	);

//set the poi invisible in liveview, mapview/listview and radar
$oObject->setVisibility(false, false, false);
ArelXMLHelper::outputObject($oObject);	

ArelXMLHelper::end();

?>