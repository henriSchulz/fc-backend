CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(20) NOT NULL,
    hash VARCHAR(200) NOT NULL,
    token VARCHAR(200) NOT NULL
)