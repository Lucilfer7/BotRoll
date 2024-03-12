require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "roll_d4",
    description: "Rolls a D4",
  },
  {
    name: "roll_d6",
    description: "Rolls a D6",
  },
  {
    name: "roll_d8",
    description: "Rolls a D8",  
  },
  {
    name: "roll_d10",
    description: "Rolls a D10",
  },
  {
    name: "roll_d12",
    description: "Rolls a D12",
  },
  {
    name: "roll_d20",
    description: "Rolls a D20",
  },
  {
    name: "roll_d100",
    description: "Rolls a D100",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log("Slash commands were registered successfully!");
  } catch (error) {
    console.error(`Error registering slash commands: ${error.message}`);
  }
})();
