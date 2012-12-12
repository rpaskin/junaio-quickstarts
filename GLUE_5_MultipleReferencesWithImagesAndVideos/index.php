<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Learn how to reference a movie texture (movie in liveview), alpha transparent movie and an image on different reference images.
 * 				
 * 				Learnings:
 * 					- using multiple reference images / coordinate systems
 * 					- create 3D Models from movies (3G2) - movie textures and images(png, jpg) to display in the live view
 * 					- using alpha transparent movies
 * 					- using AREL JS to control the movies 
 *  			
 **/
 
require_once '../ARELLibrary/arel_xmlhelper.class.php';

//use the Arel Helper to start the output with arel

//start output
ArelXMLHelper::start(NULL, "arel/index.html", "resources/tracking_glue5.zip");

//video
$oObject = ArelXMLHelper::createGLUEModel3DFromMovie(
											"movie",
											"resources/coral.3g2", 
											array(0,0,0), //translation 
											array(2.5,2.5,2.5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											1 //CoordinateSystemID)
										);
//output the object
ArelXMLHelper::outputObject($oObject);

//image
$oObject = ArelXMLHelper::createGLUEModel3DFromImage(
											"image",
											"resources/image.png", 
											array(0,-70,0), //translation 
											array(5,5,5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											2 //CoordinateSystemID)
										);
										
//output the object
ArelXMLHelper::outputObject($oObject);

//transparent video
$oObject = ArelXMLHelper::createGLUEModel3DFromMovie(
											"movieTransparent",
											"resources/sampleMovie.alpha.3g2", 
											array(0,-50,0), //translation 
											array(2.5,2.5,2.5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,-90)), //rotation
											3 //CoordinateSystemID)
										);
//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>