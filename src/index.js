require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const eventHandler = require('./handlers/eventHandlers');
const mongoose = require('mongoose');
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB, { keepAlive: true });
    console.log("connected to DB");

    eventHandler(client);

    client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.log(error);
  }
  

})();




