<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../library/arel_xmlhelper.class.php';
 
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

//metaio man location
$metaioManLocation = $position;
$metaioManLocation[1] += 0.00004;

//use the Arel Helper to start the output with arel
//start output
ArelXMLHelper::start();

//T-Rex as static obj
$oObject = ArelXMLHelper::createLocationBasedModel3D(
		"trex", //ID
		"The T-Rex", //name
		"http://dev.junaio.com/publisherDownload/junaio_model_obj.zip", //model 
		NULL, //texture
		$tRexLocation, //position
		array(5,5,5), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,-90,0)) //rotation
);

ArelXMLHelper::outputObject($oObject);

//metiao man md2
$oObject = ArelXMLHelper::createLocationBasedModel3D(
		"metaioMan", //ID
		"The metaio Man", //name
		"http://dev.junaio.com/publisherDownload/tutorial/metaioman.md2", //model 
		"http://dev.junaio.com/publisherDownload/tutorial/metaioman.png", //texture
		$metaioManLocation, //position
		array(20,20,20), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,-90)) //rotation
);
		

//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();