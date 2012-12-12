<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Using Location Based 3D models in junaio.
 * 				
 * 				Learnings:
 * 					- create two Location Based 3D Models using the Arel XML Helper
 * 					- place the metaio man and the t-rex relative to the user's current position
 * 					- use 1 obj and 1 md2 model
 *  			
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';

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

?>