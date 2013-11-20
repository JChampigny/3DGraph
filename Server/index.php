<?php

function getRandomColor() {
    $letters = str_split('0123456789ABCDEF');
    $color = '0x';

    for ($i = 0; $i < 6; $i++)
        $color .= $letters[rand(0,15)];

    return $color;
}
	
$link = mysql_connect('localhost','root',''); 
if (!$link)
	die('Could not connect to MySQL: ' . mysql_error()); 

mysql_select_db('3dgraph') or die(mysql_error());

if (isset($_GET["create"])) {
    echo "Creation...<br>";
	// Check if table already filled
	$result = mysql_query("SELECT * FROM user") or die(mysql_error());
	$row = mysql_fetch_array($result);

	if (sizeof($row) <= 0 || $row[0] == false) {
	    echo "Creating users<br>";
		for ($i = 0; $i < 20; $i++)
			mysql_query("INSERT INTO user (color) VALUES ('".getRandomColor()."')") or die(mysql_error());

	    $result = mysql_query("SELECT * FROM user") or die(mysql_error());
	}

    $category_result = mysql_query("SELECT * FROM category") or die(mysql_error());
    $row = mysql_fetch_array($category_result);

    if (sizeof($row) <= 0 || $row[0] == false) {
	    echo "Creating category<br>";

        mysql_query("INSERT INTO category (name, color) VALUES ('Cars', '".getRandomColor()."')") or die(mysql_error());
        mysql_query("INSERT INTO category (name, color) VALUES ('Food', '".getRandomColor()."')") or die(mysql_error());
        mysql_query("INSERT INTO category (name, color) VALUES ('Health', '".getRandomColor()."')") or die(mysql_error());
        mysql_query("INSERT INTO category (name, color) VALUES ('Home', '".getRandomColor()."')") or die(mysql_error());

	    $category_result = mysql_query("SELECT * FROM user") or die(mysql_error());
    }

	while ($row = mysql_fetch_array($result)) {
	    echo "Creating some data<br>";
	    for ($k = 0; $k < 20; ++$k)
	    {
	        for ($j = 0; $j < rand(1, 10); $j++)
	        {
                $query = "INSERT INTO click (user_id, category_id, date) VALUES (" . $row['id'] . ", " . rand(1, 4) . ", ADDDATE(CURDATE(), INTERVAL " . $k . " DAY))";
                mysql_query($query) or die(mysql_error());
            }
	    }
	}

	echo "Data created<br>";
} else if (isset($_GET["delete"])) {
    echo "Truncate tables...<br>";
    mysql_query("TRUNCATE TABLE click") or die(mysql_error());
    mysql_query("TRUNCATE TABLE user") or die(mysql_error());
    mysql_query("TRUNCATE TABLE category") or die(mysql_error());
} else {
	include("Classes/UserClickDay.php");
	//include("Classes/UserClickCategory.php");
	//include("Classes/CategoryClickUser.php");
	
	$graph = new UserClickDay();
	//$graph = new UserClickCategory();
	//$graph = new CategoryClickUser();
	$result = $graph->getJSON();
	
	print json_encode($result);
}

mysql_close($link); 

?>