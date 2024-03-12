const { rollMessage } = require("./rollMessage");
const crypto = require("crypto");

function handleCommand(interaction) {
  const commandName = interaction.commandName;
  const sidesString = commandName.replace(`roll_d`, "");
  const sides = parseInt(sidesString);

  if (isNaN(sides) || sides <= 0) {
    return interaction.reply("Invalid command!");
  }

  rollDice(interaction, sides);
}

function secureRandom(min, max) {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = crypto.randomBytes(bytesNeeded);
  const randomNumber = randomBytes.readUIntBE(0, bytesNeeded);
  return min + (randomNumber % range);
}

function rollDice(interaction, sides) {
  const rollResult = secureRandom(1, sides);

  const { message, image } = rollMessage(rollResult, sides);

  const file = image ? { attachment: image, name: "image.gif" } : null;

  interaction.reply({ content: message, files: file ? [file] : [] });
}

module.exports = { handleCommand };
