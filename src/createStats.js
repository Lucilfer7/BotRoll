const { secureRandom } = require("./commandHandler");

function generateCharacteristic(rollsCount, minValue, maxValue, adjustment = 0) {
  const rolls = Array.from({ length: rollsCount }, () => secureRandom(minValue, maxValue));
  const total = rolls.reduce((acc, curr) => acc + curr, 0) + adjustment;
  return total * 5;
}

function adjustEducation(characteristics, rollsCount) {
  for (let i = 0; i < rollsCount; i++) {
    const eduCheck = secureRandom(1, 100);
    if (eduCheck > characteristics.EDU) {
      characteristics.EDU += secureRandom(1, 10);
      if (characteristics.EDU > 99) {
        characteristics.EDU = 99;
      };
    };
  };
};

function calculateAgeModifiers(age, characteristics) {
  const ageModifiers = {
    '15-19': {
      STR: -5,
      SIZ: -5,
      EDU: -5,
      Luck: Math.max(secureRandom(2, 12) * 5, secureRandom(2, 12) * 5)
    },
    '20-39': adjustEducation,
    '40-49': {
      STR: -5,
      CON: -5,
      DEX: -5,
      APP: -5,
      EDU: 2
    },
    '50-59': {
      STR: -10,
      CON: -10,
      DEX: -10,
      APP: -10,
      EDU: 3
    },
    '60-69': {
      STR: -20,
      CON: -20,
      DEX: -20,
      APP: -15,
      EDU: 4
    },
    '70-79': {
      STR: -40,
      CON: -40,
      DEX: -40,
      APP: -20,
      EDU: 4
    },
    '80+': {
      STR: -80,
      CON: -80,
      DEX: -80,
      APP: -25,
      EDU: 4
    }
  };

  for (const range in ageModifiers) {
    const [min, max] = range.split('-').map(Number);
    if (age >= min && age <= max) {
      const modifier = ageModifiers[range];
      if (typeof modifier === 'function') {
        modifier(characteristics, 2); // Adjust EDU
      } else {
        for (const key in modifier) {
          // Adjust characteristic ensuring it doesn't go below 0
          characteristics[key] = Math.max(0, characteristics[key] + modifier[key]);
        }
      }
      break;
    }
  }
};

function generateLuck(age) {
  if (age <= 19) {
    return Math.max(secureRandom(2, 12) * 5, secureRandom(2, 12) * 5);
  }
  return generateCharacteristic(2,1,6,6);
}

function calculateDamageBonusAndBuild(str, siz) {
  const combined = str + siz;

  if (combined >= 2 && combined <= 64) {
    return { damageBonus: -2, build: -2 };
  } else if (combined >= 65 && combined <= 84) {
    return { damageBonus: -1, build: -1 };
  } else if (combined >= 85 && combined <= 124) {
    return { damageBonus: 0, build: 0 };
  } else if (combined >= 125 && combined <= 164) {
    return { damageBonus: secureRandom(1, 4), build: 1 };
  } else if (combined >= 165 && combined <= 204) {
    return { damageBonus: secureRandom(1, 6), build: 2 };
  } else {
    // For combined values outside the specified ranges
    return { damageBonus: 0, build: 0 };
  }
}

function calculateHitPoints(con, siz) {
  const total = Math.floor((con + siz) / 10);
  return total;
}

function calculateMovementRate(str, dex, siz, age) {
  let mov = 0;

  if (str < siz && dex < siz) {
    mov = 7;
  } else if (str >= siz || dex >= siz || (str === siz && dex === siz)) {
    mov = 8;
  } else if (str > siz && dex > siz) {
    mov = 9;
  }

  if (age >= 40 && age <= 49) {
    mov -= 1;
  } else if (age >= 50 && age <= 59) {
    mov -= 2;
  } else if (age >= 60 && age <= 69) {
    mov -= 3;
  } else if (age >= 70 && age <= 79) {
    mov -= 4;
  } else if (age >= 80) {
    mov -= 5;
  }

  return mov;
}

function calculateDS(sex) {
  if (sex === 'M') {
      let firstRoll = secureRandom(1, 20);
      let total = firstRoll;
      if (firstRoll === 20) {
          let secondRoll = secureRandom(1, 20);
          total += secondRoll;
      }
      return total;
  } else {
      return 0;
  }
}

function generateCharacter(age, sex) {
  const characteristics = {
    STR: generateCharacteristic(3, 1, 6),
    CON: generateCharacteristic(3, 1, 6),
    SIZ: generateCharacteristic(2, 1, 6, 6),
    DEX: generateCharacteristic(3, 1, 6),
    APP: generateCharacteristic(3, 1, 6),
    INT: generateCharacteristic(2, 1, 6, 6),
    POW: generateCharacteristic(3, 1, 6),
    EDU: generateCharacteristic(2, 1, 6, 6),
    Luck: generateLuck(age)
  };

  calculateAgeModifiers(age, characteristics);

  const { damageBonus, build } = calculateDamageBonusAndBuild(characteristics.STR, characteristics.SIZ);
  characteristics.damageBonus = damageBonus;
  characteristics.build = build;
  characteristics.hitPoints = calculateHitPoints(characteristics.CON, characteristics.SIZ);
  characteristics.MOV = calculateMovementRate(characteristics.STR, characteristics.DEX, characteristics.SIZ, age);
  characteristics.DS = calculateDS(sex);

  return characteristics;
}

module.exports = { generateCharacter };
