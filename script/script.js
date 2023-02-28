import { home, outside, human } from "./data.js";
console.log(home);

function makeID(arr) {
  let result = arr.map(function (obj, index) {
    return (obj = { id: index + 118, ...obj });
  });
  return result;
}

console.log(makeID(human));
