<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Nicolas King
 **/

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once 'config.php';

//WWW_ROOT will hold the path to the html folder -> makes resource referencing easier later on
 //path to online location
//define('CHANNELS_PATH', dirname(dirname(dirname(__FILE__)))); // path to channels
 // path to channels

if(isset($_GET["path"]))
	$path = $_GET["path"];
else
	$path = $_SERVER["REQUEST_URI"];

$aUrl = explode("/", $path);

if(in_array("pois", $aUrl))
{
	if(in_array_substr("search", $aUrl))
	{
		include "./../src/search.php";
		exit;
	}
}

// Wrong url
header("HTTP/1.0 404 Not found");

function in_array_substr($needle, $haystack)
{
	foreach($haystack as $value)
	{
		if(strpos($value, $needle) !== false)
			return true;
	}

	return false;
}
