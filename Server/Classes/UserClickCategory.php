<?php
require_once("iGraphModel.php");

class UserClickCategory implements iGraphModel {
	protected $query = "SELECT category_id AS dataZ, COUNT(id) AS dataY, user_id AS constant FROM click GROUP BY user_id, category_id";
	protected $axes;
	
	public function __construct() {
		$this->axes = array("constant" => "User", "dataY" => "Number of click", "dataZ" => "Category");
	}
	
	public function getQuery() {
		return $this->query;
	}
	public function getAxes() {
		return $this->axes;
	}
	public function getJSON() {
		$result = mysql_query($this->query) or die(mysql_error());
		$color = mysql_query("SELECT id, color FROM user") or die(mysql_error());
		$string = mysql_query("SELECT id, name FROM category") or die(mysql_error());
		
		$rows = array();
		$strings = array();
		$colors = array();
		$results = array();

		while ($r = mysql_fetch_assoc($color))
			$colors[] = $r;
			
		while ($r = mysql_fetch_assoc($string))
			$strings['dataZ'][] = $r;

		while ($r = mysql_fetch_assoc($result))
			$rows[] = $r;
		
		$results['axes'] = $this->axes;
		$results['colors'] = $colors;
		$results['strings'] = $strings;
		$results['data'] = $rows;
		
		return $results;
	}
}

?>