<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Stephan Evers
 **/

error_reporting(E_ALL);			//for displaying errors
ini_set("display_errors", 1);

require_once './../library/arel_xmlhelper.class.php';

$trackingXML = "http://www.junaio.com/publisherDownload/tutorial/tracking_tutorial.xml_enc";
$arelPath = "";
		
ArelXMLHelper::start(NULL,$arelPath,$trackingXML);


//Relative to Screen Overlay

$id = "overlay";
$model = WWW_ROOT."/resources/overlay.zip";
$texture = "";
$screenCoordinates = array(0.5,0.5);
$scale = array(3.5,3.5,3.5);
$rotation = array(0,0,0);

$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id,
													$model,
													$texture,
													$screenCoordinates,
													$scale,
													new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation)
												);	
			
$oObject->setOccluding(true);

ArelXMLHelper::outputObject($oObject);


//Relative to Screen Frame

$id = "frame";
$model = WWW_ROOT."/resources/frame.zip";
$texture = "";
$screenCoordinates = array(0.5,0.5);
$scale = array(3.5,3.5,3.5);
$rotation = array(0,0,0);

$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id,
													$model,
													$texture,
													$screenCoordinates,
													$scale,
													new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation)
												);	
						
ArelXMLHelper::outputObject($oObject);

// metaio man

$id = "metaioman"; 
$model = WWW_ROOT. "/resources/metaioman_xray.zip";  
$texture = "";  
$translation = array(0,0,0);  
$scale = array(21.5,21.5,21.5);  
$rotation = array(0,0,0); 
$coordinateSystemID = 1;

$oObject = ArelXMLHelper::createGLUEModel3D(	$id,
											$model,
											$texture,
											$translation,
											$scale,
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation),
											$coordinateSystemID 
										);
									
ArelXMLHelper::outputObject($oObject);

// plain

$id = "plain"; 
$model = WWW_ROOT. "/resources/plain.zip";  
$texture = "";  
$translation = array(0.5,0.5,-10000);  
$scale = array(10000,10000,10000);  
$rotation = array(0,0,0); 
$coordinateSystemID = 1;

$oObject = ArelXMLHelper::createGLUEModel3D(	$id,
											$model,
											$texture,
											$translation,
											$scale,
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation),
											$coordinateSystemID 
										);
		
ArelXMLHelper::outputObject($oObject);

ArelXMLHelper::end();

?>