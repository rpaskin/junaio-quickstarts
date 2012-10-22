<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<meta name="viewport"
	content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
<script type="text/javascript"
	src="http://dev.junaio.com/arel/js/arel_beta_min.js"></script>
<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
<script type="text/javascript">

	arel.sceneReady(function()
	{
		arel.Scene.getObject("trex").startAnimation("frame", true);
	});

	function restart(button)
	{
		//change button color
		button.style.backgroundColor='#fff';
		
		//restart the channel
		arel.Scene.switchChannel(arel.Scene.getID());		
	}
	
</script>

<style type="text/css">
* {
	-webkit-highlight: none;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
}

body {
	margin: 0px;
	padding: 0;
	-webkit-text-size-adjust: 100%;
	background-color: transparent;
}

#scan {
	border-style: solid;
	border-width: 2px;
	-webkit-border-radius: 8px;
	display: block;
	position: absolute;
	height: auto;
	width: 15%;
	bottom: 3px;
	right: 3px;
	padding: 2px;
	color: #aaa;
	background-color: #333;
	border-color: #000;
	font: normal normal bold 1em/normal Helvetica, Arial,
		sans-serif;
	text-align: center;
	opacity: 0.8;	
}
</style>

<title>Arel Instant Tracker</title>
</head>
<body>
	<div id="scanAgain">
		<div id="scan" ontouchstart="restart(this)"
			ontouchend="style.backgroundColor='#333'">Scan Again</div>
	</div>
</body>
</html>
