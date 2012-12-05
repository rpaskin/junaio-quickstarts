<?php

$path = $_SERVER['REQUEST_URI'];
$aUrl = explode('/', $path);

//might need adjustments, depending on the structure
foreach($aUrl as $path)
{
	if(strpos($path, ".zip") !== false)
	{
		$name = $path;
		break;
	}	
}

echo file_get_contents($name);

unlink($name);