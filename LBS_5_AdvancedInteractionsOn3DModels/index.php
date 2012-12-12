<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	You will be able to control a lego man in the real world. You will be given some controls as HTML buttons. Start with looking north. Once you see the lego man
 * 				you can have him walking around.
 * 				
 * 				
 * 				Learnings:
 * 					- create a html overlay
 * 					- place the lego man depending on the users position
 * 					- interact with the lego man based on pressing the html buttons
 * 					- move the lego guy based on JS timers
 **/


require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
if(!empty($_GET['l']))
    $position = explode(",", $_GET['l']);
else
    trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");
 
//start the xml output
ArelXMLHelper::start(NULL, "arel/index.php");

//return the lego man 
$oLegoMan = ArelXMLHelper::createLocationBasedModel3D(
	"1", // id
	"lego man", //title
	"resources/walking_model3_7fps.zip", // mainresource
	"resources/walking_model.png", // resource
	$position, // location
	array(0.2, 0.2, 0.2), // scale
	new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57,0,1.57)) // rotation
);

//set a translation offset for the lego man, based on the current users position
$oLegoMan->setTranslation(array(0,1000,0));

//return the model and end the output
ArelXMLHelper::outputObject($oLegoMan);
ArelXMLHelper::end();

?>