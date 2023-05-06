CREATE TABLE IF NOT EXISTS card_types (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    name VARCHAR (30) NOT NULL,
    template_front TEXT NOT NULL,
    template_back TEXT NOT NULL
)