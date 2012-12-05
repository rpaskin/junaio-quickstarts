<html>
    <head>
    	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    	<script type="text/javascript" src="js/jquery-1.7.1.min.js"></script>
       	<script type="text/javascript" src="http://dev.junaio.com/arel/js/arel.js"></script>
    	<script type="text/javascript" src="js/logic_LBS9.js"></script>
    	<link href="style.css" rel="stylesheet" type="text/css" />
    	<title>First Arel</title>
    </head>
	<body>
		<div class="filteroptions">
			<div class="filterbuttonArea">	
				<a href="#" class="filterButton">Filter</a>
			</div>
			<div class="filterOptionsInner">
				<div class="dropdown">
					<div class="label">Filter (Server):</div>
					<select id="filter">
					  <option value="">All continents</option>
					  <option value="Europe">Europe</option>
					  <option value="Asia">Asia</option>
					  <option value="NorthAmerica">North America</option>
					  <option value="SouthAmerica">South America</option>
					  <option value="Africa">Africa</option>
					</select> 
				</div>
				<div class="step">
					<form>
						<div class="label">Search (Locally):</div><input type="text" id="searchlocal" autocorrect="off" autocapitalize="off"/>				
					</form>
				</div>
			</div>			
		</div>		
	</body>            
</html>
