<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Learn about the different types of POIs available in junaio. It is a different media type linked with each POI.
 * 				
 * 				Learnings:
 * 					- create multiple POIs within 1 channel
 * 					- use the AREL XML Helper to create the XML output
 * 					- link movie, sound or image with the POI
 * 					- create a custom HTML overlay to be referenced and opened one the custom POI is clicked
 * 					- adding parameters to the POI to be used in AREL JS
 *  			
 **/

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
	include '../src/search.php';
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