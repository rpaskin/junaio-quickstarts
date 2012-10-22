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

define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location

require_once '../config/config.php';
require_once '../library/arel_xmlhelper.class.php';

if(isset($_GET['path']))
	$path = $_GET['path'];
else
	$path = $_SERVER['REQUEST_URI'];
	
$aUrl = explode('/', $path);

if(in_array('pois', $aUrl))
{
	//the visual search request holds the image
	if(in_array_substr('visualsearch', $aUrl))
	{
		include '../src/vsearch.php';
		exit;
	}
	//default request when starting
	//just return a HTML overlay with AREL JavaScript
	else if(in_array_substr('search', $aUrl))
	{
		ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", NULL);
		ArelXMLHelper::end();
		exit;
	}
}

// Wrong url
header('HTTP/1.0 404 Not found');

function in_array_substr($needle, $haystack)
{
	foreach($haystack as $value)
	{
		if(strpos($value, $needle) !== false)
			return true;
	}
	
	return false;	
}
