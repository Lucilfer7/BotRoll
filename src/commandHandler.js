const { rollMessage } = require("./rollMessage");
const crypto = require("crypto");

function handleCommand(message) {
  const msg = message.content;
  if (msg.startsWith("$rollstats")) {
    return;
  }

  const rollRegex = /^\$roll\s*(\d*)\s*d\s*(\d+)\s*([\+\-])?\s*(\d+)?$/i;
  const rollMatch = msg.match(rollRegex);

  if (rollMatch) {
    const numRolls = rollMatch[1] === "" ? 1 : parseInt(rollMatch[1]);
    const sides = parseInt(rollMatch[2]);
    const operator = rollMatch[3];
    const modifier = rollMatch[4] ? parseInt(rollMatch[4]) : 0;

    if (
      isNaN(numRolls) ||
      isNaN(sides) ||
      (operator && isNaN(modifier)) ||
      numRolls <= 0 ||
      sides <= 0
    ) {
      return message.reply("Invalid command!");
    }

    const totalModifier = operator === "-" ? -modifier : modifier;
    return rollMultipleDiceWithModifier(
      message,
      numRolls,
      sides,
      totalModifier
    );
  }

  return message.reply("Invalid command format!");
}

function secureRandom(min, max) {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = crypto.randomBytes(bytesNeeded);
  const randomNumber = randomBytes.readUIntBE(0, bytesNeeded);
  return min + (randomNumber % range);
}

function rollMultipleDiceWithModifier(msg, numRolls, sides, modifier) {
  let resultMessage = "";
  for (let i = 0; i < numRolls; i++) {
    const rollResult = secureRandom(1, sides) + modifier;
    if (numRolls === 1) {
      const { message, image } = rollMessage(rollResult, sides);
      const file = image ? { attachment: image, name: "image.gif" } : null;
      return msg.channel.send({ content: message, files: file ? [file] : [] });
    }
    resultMessage += `Roll ${i + 1}: ${rollResult}\n`;
  }
  msg.channel.send(resultMessage);
}

module.exports = { handleCommand, secureRandom };
