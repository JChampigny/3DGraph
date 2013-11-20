<?php
require_once("iGraphModel.php");

class CategoryClickUser implements iGraphModel {
	protected $query = "SELECT category_id AS constant, COUNT(id) AS dataY, user_id AS dataZ FROM click GROUP BY category_id, user_id";
	protected $axes;
	
	public function __construct() {
		$this->axes = array("constant" => "Category", "dataY" => "Number of click", "dataZ" => "User");
	}
	
	public function getQuery() {
		return $this->query;
	}
	public function getAxes() {
		return $this->axes;
	}
	public function getJSON() {
		$result = mysql_query($this->query) or die(mysql_error());
		$color = mysql_query("SELECT id, color FROM category") or die(mysql_error());
		$string = mysql_query("SELECT id, name FROM category") or die(mysql_error());

		$rows = array();
		$strings = array();
		$colors = array();
		$results = array();

		while ($r = mysql_fetch_assoc($color))
			$colors[] = $r;
			
		while ($r = mysql_fetch_assoc($string))
			$strings['constant'][] = $r;

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