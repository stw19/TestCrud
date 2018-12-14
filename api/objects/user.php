<?php
class User{
 
    // database connection and table name
    private $conn;
    private $table_name = "utenti";
 
    // object properties
    public $id;
    public $username;
    public $nome;
    public $cognome;
    public $email;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

	// read users
	function read(){
		// select all query
		$query = "SELECT *
				FROM
					" . $this->table_name . " u
				ORDER BY u.id";
 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
 
		// execute query
		$stmt->execute();
 
		return $stmt;
	}
	// create user
	function create(){
 
		// query to insert record
		$query = "INSERT INTO
					" . $this->table_name . "
				SET
					username=:username, nome=:nome, cognome=:cognome, email=:email"; 
		// prepare query
		$stmt = $this->conn->prepare($query);
 
		// sanitize
		$this->username=htmlspecialchars(strip_tags($this->username));
		$this->nome=htmlspecialchars(strip_tags($this->nome));
		$this->cognome=htmlspecialchars(strip_tags($this->cognome));
		$this->email=htmlspecialchars(strip_tags($this->email));
 
		// bind values
		$stmt->bindParam(":username", $this->username);
		$stmt->bindParam(":nome", $this->nome);
		$stmt->bindParam(":cognome", $this->cognome);
		$stmt->bindParam(":email", $this->email);
 
		// execute query
		if($stmt->execute()){
			return true;
		}
 
		return false;
     
	}
	// used when filling up the update user form
	function readOne(){
 
		// query to read single record
		$query = "SELECT *
				FROM
					" . $this->table_name . " u
				WHERE
					u.id = ?
				LIMIT
					0,1";
 
		// prepare query statement
		$stmt = $this->conn->prepare( $query );
 
		// bind id of user to be updated
		$stmt->bindParam(1, $this->id);
 
		// execute query
		$stmt->execute();
 
		// get retrieved row
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
 
		// set values to object properties
		$this->username = $row['username'];
		$this->nome = $row['nome'];
		$this->cognome = $row['cognome'];
		$this->email = $row['email'];
	}
	// update the user
	function update(){
 
		// update query
		$query = "UPDATE
					" . $this->table_name . "
				SET
					username = :username,
					nome = :nome,
					cognome = :cognome,
					email = :email
				WHERE
					id = :id";
 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
 
		// sanitize
		$this->username=htmlspecialchars(strip_tags($this->username));
		$this->nome=htmlspecialchars(strip_tags($this->nome));
		$this->cognome=htmlspecialchars(strip_tags($this->cognome));
		$this->email=htmlspecialchars(strip_tags($this->email));
		$this->id=htmlspecialchars(strip_tags($this->id));
 
		// bind new values
		$stmt->bindParam(':username', $this->username);
		$stmt->bindParam(':nome', $this->nome);
		$stmt->bindParam(':cognome', $this->cognome);
		$stmt->bindParam(':email', $this->email);
		$stmt->bindParam(':id', $this->id);
 
		// execute the query
		if($stmt->execute()){
			return true;
		}
 
		return false;
	}
	// delete the user
	function delete(){

		$exist = "SELECT id FROM " . $this->table_name . " WHERE id = ?";
		$exc = $this->conn->prepare($exist);
		$exc->bindParam(1, $this->id);
		//checks if the selected id exists
		if(!$exc->execute()){
			return false;
		}
 
		// delete query
		$query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
 
		// prepare query
		$stmt = $this->conn->prepare($query);
 
		// sanitize
		$this->id=htmlspecialchars(strip_tags($this->id));
 
		// bind id of record to delete
		$stmt->bindParam(1, $this->id);
 
		// execute query
		if($stmt->execute()){
			return true;
		}
 
		return false;
     
	}
	// search users
	function search($keywords){
 
		// select all query
		$query = "SELECT *
				FROM
					" . $this->table_name . " u
				WHERE
					u.username LIKE ? OR u.nome LIKE ? OR u.cognome LIKE ? OR u.email LIKE ?
				ORDER BY
					u.id DESC";
 
		// prepare query statement
		$stmt = $this->conn->prepare($query);
 
		// sanitize
		$keywords=htmlspecialchars(strip_tags($keywords));
		$keywords = "%{$keywords}%";
 
		// bind
		$stmt->bindParam(1, $keywords);
		$stmt->bindParam(2, $keywords);
		$stmt->bindParam(3, $keywords);
		$stmt->bindParam(4, $keywords);
 
		// execute query
		$stmt->execute();
 
		return $stmt;
	}
}
?>