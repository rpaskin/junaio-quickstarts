<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Using 3D models in a 360 degree setting in junaio and learn how to do animations with AREL JavaScript
 * 				
 * 				Learnings:
 * 					- create two 3D Models using the Arel XML Helper
 * 					- place the t-rex and the metaio man relative to the user's position
 * 					- use 1 zipped md2 and an encrypted md2
 * 					- start animations using AREL JavaScript and react to its callbacks
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
//use the Arel Helper to start the output with arel
//start output
ArelXMLHelper::start(NULL, "/arel/index.html", ArelXMLHelper::TRACKING_ORIENTATION);

//T-Rex as encrypted md2
// We are using relative offsets, so we don't need a location based model
$oObject = ArelXMLHelper::createGLUEModel3D(
		"trex", //ID
		"http://dev.junaio.com/publisherDownload/tutorial/trex.md2_enc", //model 
		"http://dev.junaio.com/publisherDownload/tutorial/trextexture.png", //texture
		array(4000,0,-1300), //1 meter in x direction
		array(3,3,3), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)),	//rotation
		1
);

//output the trex
ArelXMLHelper::outputObject($oObject);

//metiao man zipped md2
$oObject = ArelXMLHelper::createGLUEModel3D(
		"metaioMan", //ID
		"http://dev.junaio.com/publisherDownload/tutorial/metaioman.zip", //model 
		NULL, //texture
		array(2000, -700, -1300), //position
		array(8,8,8), //scale
		new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,90)), //rotation
		1
);

//output the metaio man
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>
