# DiscordBotJerryGame

_:tada::tada::tada:Fishing Bot!！:tada::tada::tada:_<br>
_:tada::tada::tada:钓鱼模拟器!！:tada::tada::tada:_

## Introduction

This is a discord chatbot base on discord.js

## Functions

  -Players can sign in every day to get some free gold and lures<br>
  -Players can get different types of fish from fishing<br>
  -Fish can be sold, kept and traded among players<br>
  -Players can upgrade their fishing tackle to enhance their fishing process<br>
  -There will be a collection to show player’s achievements in fishing<br>
  -More details will be shown on the command descriptions

## Install

1. Create Your Discord App and Discord Bot on Discord Developer portal (save your bot token)
2. Download the clone of this application from git
```
 git clone https://github.com/429495429/DiscordBotJerryGame.git
```
3. sign in on the MongoDB and creat your own database
4. Install the application with dependencies and other supportint tools
```
    npm install
    npm install pm2 -g
```
5. Modify your .env files with your own bot token and mongodb connections
6. Run the application with pm2
```
    pm2 start src/index.js
```
