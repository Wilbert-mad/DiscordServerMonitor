CREATE TABLE IF NOT EXISTS Messages (
  id                    TEXT NOT NULL PRIMARY KEY,
  channel_id            TEXT NOT NULL,
  guild_id              TEXT NOT NULL,
  content               TEXT NOT NULL,
  timestamp             TEXT NOT NULL,
  type                  INIT NOT NULL,
  author                TEXT NOT NULL,
  edited_timestamp      TEXT,
  referenced_message_id TEXT,
  mentions              TEXT NOT NULL DEFAULT "[]",
  -- embeds TEXT NOT NULL DEFAULT "[]", -- may no be needed as normal users can make embeds and only bots should be able to.
  attachments           TEXT NOT NULL DEFAULT "[]"
);

-- drop
-- DROP TABLE Messages;
