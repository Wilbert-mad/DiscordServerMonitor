CREATE TABLE IF NOT EXISTS User (
  I           INIT PRIMARY KEY,
  TOKEN       TEXT,
  LOGIN_TOKEN TEXT NOT NULL,
  eventsData  TEXT NOT NULL DEFAULT "[]"
);

