var parseCronExpression = require("./index.js");

const TEST_CASES = {
  "*/15 0 1,15 * 1-5": "Deliveroo Example",
  "0 12 * * ?": "At 12:00 p.m. (noon) every day:",
  "0/5 13,18 * * ?":
    "Every five minutes starting at 1 p.m. and ending at 1:55 p.m. and then starting at 6 p.m. and ending at 6:55 p.m., every day:",
  "0-5 13 * * ?":
    "Every minute starting at 1 p.m. and ending at 1:05 p.m., every day:",
  "15,45 13 ? 6 Tue":
    "At 1:15 p.m. and 1:45 p.m. every Tuesday in the month of June:",
  "30 9 ? * MON-FRI":
    "At 9:30 a.m. every Monday, Tuesday, Wednesday, Thursday and Friday:",
  "30 9 15 * ?": "At 9:30 a.m. on the 15th day of every month:",
  "0 18 L * ?": "At 6 p.m. on the last day of every month:",
  "0 18 L-3 * ?": "At 6 p.m. on the third to last day of every month:",
  "30 10 ? * 5L": "At 10:30 a.m. on the last Thursday of every month:",
  "0 10 ? * 2#3": "At 10 a.m. on the third Monday of every month:",
  "0 0 10/5 * ?":
    "At 12 midnight on every day for five days starting on the 10th day of the month:",
};

const testExpressions = Object.keys(TEST_CASES);
testExpressions.forEach((expression, index) => {
  const explaination = TEST_CASES[expression];
  expression += " command";
  console.log("Test Expression ", index, ": ", expression);
  console.log("Explaination: ", explaination);
  console.log("-------------PARSE TABLE-----------");
  parseCronExpression(expression);
  console.log("-----------------END---------------");
});
