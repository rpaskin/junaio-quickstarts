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
	define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location
	
	//the search return needs to be provided
	include 'search.php';
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