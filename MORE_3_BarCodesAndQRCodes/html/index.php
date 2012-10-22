<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	This tutorial will show you how to create a simple barcode and QR Code scanner. The information is not processed further, it is just being displayed.
 * 				 				
 * 				Learnings:
 * 					- using the barcode / QR Code tracking configuration
 * 					- getting the barcode / QR Code information from the tracking event
 * 					- using the torch (iPhone only)
 **/

require_once '../library/arel_xmlhelper.class.php';

//if issues occur with htaccess, also the path variable can be used
//htaccess rewrite enabled:
//Callback URL: http://www.callbackURL.com
//
//htacces disabled:
//Callback URL: http://www.callbackURL.com/?path=

if(isset($_GET['path']))
	$path = $_GET['path'];
else
	$path = $_SERVER['REQUEST_URI'];
	
$aUrl = explode('/', $path);

//if the request if correct, return the information
if(in_array_substr('search', $aUrl))
{
	//define the public path
	//this will be used for refreencing information in the search.php
	define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location

	//the search return needs to be provided
	ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", ArelXMLHelper::TRACKING_BARCODE_QR);
	ArelXMLHelper::end();
	exit;
}	


// Wrong request -> return not found
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