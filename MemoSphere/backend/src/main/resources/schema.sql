CREATE TABLE IF NOT EXISTS feelings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT
);

CREATE TABLE IF NOT EXISTS entries (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS entry_feelings (
    entry_id TEXT,
    feeling_id TEXT,
    PRIMARY KEY (entry_id, feeling_id),
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
    FOREIGN KEY (feeling_id) REFERENCES feelings(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS entry_activities (
    entry_id TEXT,
    activity_id TEXT,
    PRIMARY KEY (entry_id, activity_id),
    FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE RESTRICT
);