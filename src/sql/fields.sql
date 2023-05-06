CREATE TABLE IF NOT EXISTS fields (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    name VARCHAR (30) NOT NULL,
    card_type_id VARCHAR(8) REFERENCES card_types(id),
    client_id VARCHAR (8) NOT NULL REFERENCES clients(id)
)