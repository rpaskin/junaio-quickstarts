<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	This tutorial provides a model using a reflection map.
 * 				 				
 * 				Learnings:
 * 					- how to use reflection maps
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';

//use the Arel Helper to start the output with arel


/**
 * 	For more information about using reflection map, please look at those pages:
 * 	
 * 	http://docs.metaio.com/bin/view/Main/EnvironmentMapping
 *  http://dev.metaio.com/sdk/tutorials/content-types/
 * 
 */

//start output
ArelXMLHelper::start(NULL, NULL, "http://www.junaio.com/publisherDownload/tutorial/tracking_tutorial.zip");

//output the truck with reflection maps included
$oObject = ArelXMLHelper::createGLUEModel3D(
											"1",	//ID 
											"truck.zip", //model Path 
											NULL, //texture Path
											array(0,0,0), //translation
											array(1,1,1), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90,0,0)), //rotation
											1 //CoordinateSystemID
										);
//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();

?>