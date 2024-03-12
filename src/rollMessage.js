require("dotenv").config();
const fs = require("fs");
const path = require("path");

function isGoodRoll(result, sides) {
  if (sides === 100) {
    if (result === 1) {
      return "Critical success";
    } else if (result >= 96 && result <= 100) {
      return "Fumble";
    } else {
      return "Average roll";
    }
  } else {
    const thresholds = calculateThresholds(sides);
    switch (true) {
      case result >= thresholds[1] && result <= thresholds[0]:
        return "Great roll";
      case result >= thresholds[2] && result < thresholds[1]:
        return "Good roll";
      case result >= thresholds[3] && result < thresholds[2]:
        return "Average roll";
      case result >= 1 && result < thresholds[3]:
        return "Bad roll";
      default:
        return "Unknown roll";
    }
  }
}

function calculateThresholds(sides) {
  const increment = sides / 4;
  const thresholds = [];
  let threshold = sides;

  for (let i = 0; i < 4; i++) {
    thresholds.push(threshold);
    threshold -= increment;
  }

  return thresholds;
}

function rollMessage(result, sides) {
  let replyMessage = "";
  let attachment;

  const rollQuality = isGoodRoll(result, sides); // Determine the quality of the roll

  switch (rollQuality) {
    case "Great roll":
      replyMessage = `🎲🧏🤫 Brilliant! You've rolled a ${result} on a D${sides}. Stop cheating 🧏🤫🎲`;
      attachment = getRandomImage(`${process.env.PATH_CODE}good/`);
      break;
    case "Good roll":
      replyMessage = `🎲👻 Not bad for someone like you. You've rolled a ${result} on a D${sides} 👻🎲`;
      break;
    case "Average roll":
      if (result === 13) {
        replyMessage = `😈👹 The more you suck it, the more it grows. You've rolled a ${result} 👹👿`; // spanish joke, sorry if you don't understand it
      } else if (result === 69) {
        replyMessage = `😈🥵 69. Nice one. 🥵😈`;
      } else {
        replyMessage = `🎲🥸 You got a ${result} on a D${sides} 🥸🎲`;
      }
      break;
    case "Bad roll":
      replyMessage = `🎲🗿 Great! You got a ${result} on a D${sides} 🗿🎲`;
      attachment = getRandomImage(`${process.env.PATH_CODE}bad/`);
      break;
    case "Critical success":
      replyMessage = `🎲🌟 Critical success! You've rolled a ${result} on a D${sides}! 🌟🎲`;
      attachment = getRandomImage(`${process.env.PATH_CODE}good/`);
      break;
    case "Fumble":
      replyMessage = `🎲💥 Oh no! You've rolled a ${result} on a D${sides}! It's a fumble! 💥🎲`;
      attachment = getRandomImage(`${process.env.PATH_CODE}bad/`);
      break;
    default:
      replyMessage = `🎲😕 You've rolled ${result} on a D${sides}... Not the best result! 🤔🎲`;
      break;
  }

  return { message: replyMessage, image: attachment };
}

function getRandomImage(directory) {
  try {
    const images = fs.readdirSync(directory);
    const randomIndex = Math.floor(Math.random() * images.length);
    const imageName = images[randomIndex];
    const imagePath = path.join(directory, imageName);
    return imagePath;
  } catch (error) {
    console.error("Error trying to get a random image:", error);
    return null;
  }
}

module.exports = { rollMessage };
