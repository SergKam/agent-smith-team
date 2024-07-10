drop database if exists task_manager;
create database if not exists task_manager;
use task_manager;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL,
    type ENUM('story', 'task', 'question', 'bug') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    assignedTo INT,
    FOREIGN KEY (assignedTo) REFERENCES users(id)
);

CREATE TABLE task_relations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskId INT,
    relatedTaskId INT,
    relationType VARCHAR(255),
    FOREIGN KEY (taskId) REFERENCES tasks(id),
    FOREIGN KEY (relatedTaskId) REFERENCES tasks(id)
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    taskId INT,
    userId INT,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (taskId) REFERENCES tasks(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);
