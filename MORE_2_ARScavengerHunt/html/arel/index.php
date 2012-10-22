<html>
    <head>
    	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
       	<script type="text/javascript" src="http://dev.junaio.com/arel/js/arel_beta_min.js"></script>
    	<script type="text/javascript" src="js/logic_More2.js"></script>
    	<title>First Arel</title>
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
			width: 20%;
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
		</style>
		
		<title>Arel Instant Tracker</title>
	</head>
	<body>
		<div id="scan" ontouchstart="switchMode(this)" ontouchend="style.backgroundColor='#333'">Scan Treasure</div>	
		<div id="center">
			<div id="info">Look for treasures. When you are close, scan it!</div>			
		</div>		
	</body>
</html>
