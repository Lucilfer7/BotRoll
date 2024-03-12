require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { handleCommand } = require("./commandHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅ ${c.user.username} is online.`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName) {
    handleCommand(interaction)
  }
});

client.login(process.env.TOKEN);
