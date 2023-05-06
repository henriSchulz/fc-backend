CREATE TABLE IF NOT EXISTS stacks (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    client_id VARCHAR (8) NOT NULL REFERENCES clients(id),
    name VARCHAR (30) NOT NULL
)