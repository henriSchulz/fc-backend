CREATE TABLE IF NOT EXISTS fieldContents (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    lastModifiedAt TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    fieldId VARCHAR(8) NOT NULL REFERENCES fields(id),
    cardId VARCHAR(8) NOT NULL REFERENCES cards(id),
    stackId VARCHAR(8) NOT NULL REFERENCES stacks(id),
    clientId VARCHAR (8) NOT NULL REFERENCES clients(id),
    content TEXT NOT NULL
)