CREATE TABLE Users (
    user_discord_id INT PRIMARY KEY,
    region VARCHAR(6) NOT NULL,
    username_lol VARCHAR(50) NOT NULL,
    currentGameId CHAR(78)
);

CREATE TABLE SpyStatusPerGuild (
    guildId INT PRIMARY KEY,
    activated boolean DEFAULT False,
    channelId INT NOT NULL
);
