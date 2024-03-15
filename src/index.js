require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const { handleCommand } = require("./commandHandler");
const { generateCharacter } = require("./createStats");

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
  
  if (message.content.startsWith("$rollstats")) {
    const args = message.content.split(" ");

    // Obtener la edad del segundo argumento (si está presente)
    let age = null;
    let sex = '';
    if (args.length > 1 && !isNaN(args[1])) {
      age = parseInt(args[1]);
      sex = args[2]
    }

    // Genera las características del personaje, pasando la edad como argumento
    const characteristics = generateCharacter(age, sex);
    const response = `
    **AGE:** ${age}
**STR (Strength):** ${characteristics.STR}
**CON (Constitution):** ${characteristics.CON}
**SIZ (Size):** ${characteristics.SIZ}
**DEX (Dexterity):** ${characteristics.DEX}
**APP (Appearance):** ${characteristics.APP}
**INT (Intelligence):** ${characteristics.INT}
**POW (Power):** ${characteristics.POW}
**EDU (Education):** ${characteristics.EDU}
**Luck:** ${characteristics.Luck}
**Damage Bonus:** ${characteristics.damageBonus}
**Build:** ${characteristics.build}
**Hit Points:** ${characteristics.hitPoints}
**MOV (Movement Rate):** ${characteristics.MOV}
${sex === 'M' ? `**Dick Size:** ${characteristics.DS}` : ``}
`;

    // Envía el mensaje al canal de Discord
    message.channel.send(response);
  }

  if (message.content.startsWith("$roll")) {
    handleCommand(message);
  }
});


client.login(process.env.TOKEN);
