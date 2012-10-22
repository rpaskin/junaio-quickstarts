<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/
 
require_once '../config/config.php';
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/lib/client.php';
require_once '../library/arel_xmlhelper.class.php';


if(isset($_GET['l']))
	$position = explode(",", $_GET['l']);

//check if a file was uploaded (the screenshot from the user)
if(is_uploaded_file($_FILES['image']['tmp_name'])) 
{
	//get the file
	$aFiles['file[]'] = $_FILES['image']['tmp_name'];
	
	//create the tracking configuration
	$oJunaioClient = new JunaioApiClient();
	$oResponse = $oJunaioClient->request(
				'/tools/trackingxml',
				'POST',
				array("encrypt" => "false"),
				array(USER => PASSWORD),
				$aFiles);	

	if($oResponse->getStatus() == 200)
	{
		//receive the information
		$data = $oResponse->getBody();
		$name = "tracking_" . floor(microtime(true))."_".rand(0, 1000) . ".zip";
		$path = "trackingfiles/" . $name;
		$wwwPath = WWW_ROOT . "/trackingfiles/fileHandler.php/$name";
		
		//store the tracking configuration on your server
		$fh = fopen($path, "w+");
		fwrite($fh, $data);
		fclose($fh);	
		
		//make the return!
		ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/indexVS.php", $wwwPath);
		
		//create the trex output 
		$oObject = ArelXMLHelper::createGLUEModel3D(
				"trex", //ID
				"http://dev.junaio.com/publisherDownload/tutorial/trex.md2", //model 
				"http://dev.junaio.com/publisherDownload/tutorial/trextexture.png", //texture
				array(0,0,0), //position
				array(.3,.3,.3), //scale
				new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,180)), //rotation
				1 //coordinate system ID
		);	

		//return the object
		ArelXMLHelper::outputObject($oObject);
		
		ArelXMLHelper::end();
	}
	else
	{
		echo "error tracking!";
		exit;
	}
}
else
{
	echo "error file!";
	exit;
}