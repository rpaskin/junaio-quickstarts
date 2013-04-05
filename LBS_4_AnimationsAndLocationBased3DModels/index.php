<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Using Location Based 3D models in junaio and learn how to do animations with AREL JavaScript
 * 				
 * 				Learnings:
 * 					- create two Location Based 3D Models using the Arel XML Helper
 * 					- place the t-rex and the metaio manbased on the user's position
 * 					- add a translation offset to the metaio man
 * 					- use 1 zipped md2 and an encrypted md2
 * 					- start animations using AREL JavaScript
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
/**
 * When the channel is being viewed, a poi request will be sent
 * $_GET['l']...(optional) Position of the user when requesting poi search information
 * $_GET['o']...(optional) Orientation of the user when requesting poi search information
 * $_GET['p']...(optional) perimeter of the data requested in meters.
 * $_GET['uid']... Unique user identifier
 * $_GET['m']... (optional) limit of to be returned values
 * $_GET['page']...page number of result. e.g. m = 10: page 1: 1-10; page 2: 11-20, e.g.
 **/

if(!empty($_GET['l']))
    $position = explode(",", $_GET['l']);
else
    trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");
 
//calculate the position of T-Rex based on the position of the request. An offset is added to the latitude value.
$tRexLocation = $position;
$tRexLocation[0] += 0.00004;

//use the Arel Helper to start the output with arel
//start output
ArelXMLHelper::start(NULL, "/arel/index.html", ArelXMLHelper::TRACKING_GPS);

//T-Rex as encrypted md2
$oObject = ArelXMLHelper::createLocationBasedModel3D(
		"trex", //ID
		"The T-Rex", //name
		"http://dev.junaio.com/publisherDownload/tutorial/trex.md2_enc", //model 
		"http://dev.junaio.com/publisherDownload/tutorial/trextexture.png", //texture
		$tRexLocation, //position
		array(3,3,3), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)) //rotation
);

//output the trex
ArelXMLHelper::outputObject($oObject);

//metiao man zipped md2
$oObject = ArelXMLHelper::createLocationBasedModel3D(
		"metaioMan", //ID
		"The metaio Man", //name
		"http://dev.junaio.com/publisherDownload/tutorial/metaioman.zip", //model 
		NULL, //texture
		$tRexLocation, //position
		array(10,10,10), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,90)) //rotation
);
		
//set a translation as offset
$oObject->setTranslation(array(-1000, -800, 0));

//output the metaio man
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>