<?php
require_once("iGraphModel.php");

class UserClickDay implements iGraphModel {
	protected $query = "SELECT user_id AS constant, COUNT(id) AS dataY, date AS dataZ FROM click GROUP BY user_id, date";
	protected $axes;
	
	public function __construct() {
		$this->axes = array("constant" => "User", "dataY" => "Number of click", "dataZ" => "Date");
	}
	
	public function getQuery() {
		return $this->query;
	}
	public function getAxes() {
		return $this->axes;
	}
	public function getJSON() {
		$result = mysql_query($this->query) or die(mysql_error());
		$string = mysql_query("SELECT * FROM user") or die(mysql_error());
		
		$rows = array();
		$strings = array();
		$colors = array();

		while ($r = mysql_fetch_assoc($string))
			$colors[] = $r;
		
		while ($r = mysql_fetch_assoc($result))
			$rows[] = $r;
		
		$strings['axes'] = $this->axes;
		$strings['colors'] = $colors;
		$strings['data'] = $rows;
		
		return $strings;
	}
}

?>