CREATE TABLE IF NOT EXISTS card_types (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    lastModifiedAt TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    name VARCHAR (30) NOT NULL,
    templateFront TEXT NOT NULL,
    templateBack TEXT NOT NULL,
    clientId VARCHAR (8) NOT NULL REFERENCES clients(id)
)