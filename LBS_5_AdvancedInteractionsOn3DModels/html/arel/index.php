<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
		<script src="js/jquery-1.7.1.min.js" type="text/javascript"></script>
		<script src="http://dev.junaio.com/arel/js/arel_beta_min.js" type="text/javascript"></script>
		<script src="js/logic_LBS5.js" type="text/javascript"></script>
		<link href="css/styles.css" type="text/css" rel="stylesheet" />
		<title>AREL LEGO DEMO</title>
	</head>
	<body>
	
	<?php
	// switches between different styles for the buttons:
	// on iPhone they should be smaller...
	
	$agent = strtolower($_SERVER['HTTP_USER_AGENT']);
	
	if(strpos($agent, "ipad") !== FALSE) {
		echo "<div id=\"buttons\" class=\"ipad\">";
	} else {
		echo "<div id=\"buttons\" class=\"iphone\">";
	}
	?>
	
		<!-- the buttons for the controls - style is defined in the css -->
		<div id="spacer"></div>
		<div id="top"></div>
		<div id="left"></div>
		<div id="down"></div>
		<div id="right"></div>
		</div>
	</body>
</html>
