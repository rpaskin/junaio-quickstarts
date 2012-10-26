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
		$('#scanCenter').fadeIn("slow");
	});
	
	function scanNow(button)
	{
		//change button color
		button.style.backgroundColor='#fff';
		
		//get the image from the client	and send it to the pois/visualsearch interface
		arel.Scene.startInstantTracking(arel.Tracking.INSTANT2DG);
		$('#scanCenter').fadeOut("slow");
		$('#center').fadeOut("slow");
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

#center {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 70%;
	height: 70%;
	margin-top: -35%;
	margin-left: -35%;
}

#info {
	border-color: #aaa;
	border-style: solid;
	border-width: 2px;
	-webkit-border-radius: 8px;
	display: block;
	position: absolute;
	height: auto;
	bottom: 0;
	top: 0;
	left: 0;
	right: 0;
	padding: 10px;
	color: #fff;
	font: normal normal bold 12px/normal Helvetica, Arial, sans-serif;
	text-align: center;
	opacity: 0.8;
}

#scanCenter {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 70%;
	height: 2.3em;
	margin-top: 37%;
	margin-left: -35%;
	display: none;
}

#scan {
	border-style: solid;
	border-width: 2px;
	-webkit-border-radius: 8px;
	display: block;
	position: absolute;
	height: auto;
	bottom: 0;
	top: 0;
	left: 0;
	right: 0;
	padding: 2px;
	color: #aaa;
	background-color: #333;
	border-color: #000;
	font: normal normal bold 1.5em/normal Helvetica, Arial,
		sans-serif;
	text-align: center;
	opacity: 0.8;	
}
</style>

<title>Arel Instant Tracker</title>
</head>
<body>
	<div id="center">
		<div id="info">Hold your phone above an image and press "Scan".</div>
	</div>
	<div id="scanCenter">
		<div id="scan" ontouchstart="scanNow(this)"
			ontouchend="style.backgroundColor='#333'">Scan</div>
	</div>
</body>
</html>
