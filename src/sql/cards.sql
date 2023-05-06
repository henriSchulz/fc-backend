CREATE TABLE IF NOT EXISTS cards (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    client_id VARCHAR (8) NOT NULL REFERENCES clients(id),
    stack_id VARCHAR (8) NOT NULL REFERENCES stacks(id),
    card_type_id VARCHAR (8) NOT NULL REFERENCES card_types(id),
    due_at TIMESTAMP NOT NULL,
    learning_stack INTEGER NOT NULL,
    paused NUMBER(1)
)