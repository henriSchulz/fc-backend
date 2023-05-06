CREATE TABLE IF NOT EXISTS fieldContents (
    id VARCHAR(8) PRIMARY KEY NOT NULL,
    created_at TIMESTAMP NOT NULL,
    last_modified_at TIMESTAMP NOT NULL,
    version INTEGER NOT NULL,
    field_id VARCHAR(8) NOT NULL REFERENCES fields(id),
    card_id VARCHAR(8) NOT NULL REFERENCES cards(id),
    stack_id VARCHAR(8) NOT NULL REFERENCES stacks(id)
)