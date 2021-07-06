CREATE TABLE account (
	id INT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(20),
	PASSWORD VARCHAR(20),
	ROLE VARCHAR(10) DEFAULT 'user'
);

CREATE TABLE content (
	id_content INT AUTO_INCREMENT PRIMARY KEY,
	content TEXT,
	id_user INT,
	id_can_view JSON,
	FOREIGN KEY (id_user) REFERENCES account(id)
);