<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	This tutorial is a basic tutorial for using junaio in combination with ID Markers and marker interactions.
 * 				The idea is to be able to hide ID Marker 2 or 3 and this triggers an animation. So if either of those markers is tracking, nothing happens, but 
 * 				if one looses the tracking, the rotation of the lego man on marker 1 starts.
 * 
 *  			Learnings:
 *  					- Using ID Markers
 *  					- Controlling interactions by hiding a marker
 *  					- advanced usage of AREL JavaScript
 *  					- handling multiple tracking events
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';

//use the Arel Helper to start the output with arel

//start output
ArelXMLHelper::start(NULL, "/arel/index.html", "/resources/trackingXML1-3.xml");

//return the trooper and place him on ID Marker 2
$oObject = ArelXMLHelper::createGLUEModel3D(
											"lTrooper",	//ID 
											"/resources/legoStormTrooper.zip", //model 
											"/resources/legoStormTrooper.png", //texture
											array(0,0,0), //translation
											array(0.05,0.05,0.05), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											2 //CoordinateSystemID
										);

ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>