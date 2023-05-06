CREATE TABLE IF NOT EXISTS fields (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    lastModifiedAt TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    name VARCHAR (30) NOT NULL,
    cardTypeId VARCHAR(8) REFERENCES card_types(id),
    clientId VARCHAR (8) NOT NULL REFERENCES clients(id)
)