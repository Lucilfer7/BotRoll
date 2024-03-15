const { secureRandom } = require("./commandHandler");

for (let i = 1; i <= 1000; i++) {
  let num = secureRandom(1, 10);
  console.log(num)
}