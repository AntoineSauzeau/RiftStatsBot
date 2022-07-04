CREATE TABLE Users (
    user_discord_id INT PRIMARY KEY,
    region VARCHAR(6) NOT NULL,
    username_lol VARCHAR(50) NOT NULL,
    currentGamePuuid CHAR(78)
);
