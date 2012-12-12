<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Using junaio's pois/visualsearch interface to create your own instant tracker. The user can take a screenshot where a t-rex will be 
 * 				overlaid immediately.
 * 				IMPORTANT: The Zend framework will be required for this tutorial. The link to the Zend freamework is required in the config.php. 
 * 				Also, valid junaio credentials need to be given in the config.php
 * 				Your server (www_data) needs to have writing access to the trackingfiles folder
 * 				
 * 				Learnings:
 * 					- using pois/visualsearch
 * 					- send a screenshot done by the user to your server
 * 					- use tools/trackingxml to create a tracking xml
 *  			
 **/

//use the Arel Helper to start the output with arel
require_once '../ARELLibrary/arel_xmlhelper.class.php';

//start output
ArelXMLHelper::start(NULL, "index.html", NULL);

//return the metaio man on coordinate system 1 / reference image 1
$oObject = ArelXMLHelper::createGLUEModel3D(
		"1",	//ID 
	"http://dev.junaio.com/publisherDownload/tutorial/metaioman.md2", //model Path 
	"http://dev.junaio.com/publisherDownload/tutorial/metaioman.png", //texture Path
	array(0,0,0), //translation
	array(3,3,3), //scale
	new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
	1 //CoordinateSystemID
);

//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>