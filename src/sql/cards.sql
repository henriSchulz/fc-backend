CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    createdAt TIMESTAMP NOT NULL,
    lastModifiedAt TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    clientId VARCHAR (8) NOT NULL REFERENCES clients(id),
    stackId VARCHAR (8) NOT NULL REFERENCES stacks(id),
    cardTypeId VARCHAR (8) NOT NULL REFERENCES card_types(id),
    dueAt TIMESTAMP NOT NULL,
    learningState INTEGER NOT NULL,
    paused NUMBER(1)
)