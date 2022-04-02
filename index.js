// Accept input expression from command line
const inputExpression = process.argv[process.argv.length - 1].split(" ");

// Print width of expression name
const FIELD_NAME_LENGTH = 14;

// Map of maximum values of each expression in order of cron format. The order is important and used in results produced
const EXPRESSION_MAXVAL_MAP = {
  Minutes: 59,
  Hours: 23,
  "Day of month": 31,
  Month: 12,
  "Day of week": 7,
  Command: "",
};

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const WEEKS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Helper to convert number to readble n'th format
const numberToReadable = (number) => {
  const NUM_READABLE_MAP = ["1st", "2nd", "3rd"];
  return number < 3 ? NUM_READABLE_MAP[number - 1] : number + "th";
};

/**
 * Function to parse individual field.
 * @param {*} expression Individual field after splitting the whole expression
 * @param {*} fieldName The name of field (as per the MAP constant above. Used for getting maximum values)
 * @param {*} fieldIndex Index of field as per cromn sequence. Just to keep a check that time starts from 0 and month, days, week starts from 1
 * @returns parse expression array. including all possible values.
 */
const parseEachExpression = (expression, fieldName, fieldIndex) => {
  const returnValues = [];
  let initialValue = fieldIndex > 1 ? 1 : 0;

  if (expression == 0) {
    returnValues.push(0);
  } else if (expression === "*") {
    const maxValue = EXPRESSION_MAXVAL_MAP[fieldName];
    while (initialValue <= maxValue) {
      returnValues.push(initialValue++);
    }
  } else if (expression === "?") {
    returnValues.push("ANY");
  } else if (expression === "L") {
    returnValues.push(EXPRESSION_MAXVAL_MAP[fieldName]);
  } else if (expression.includes("L")) {
    const splitExp = expression.split("L");
    const prefix = parseInt(splitExp[0]);
    if (!isNaN(prefix)) {
      returnValues.push(
        `Last occurence ${numberToReadable(prefix)} ${fieldName}`
      );
    } else {
      const lastValue = EXPRESSION_MAXVAL_MAP[fieldName];
      const value = eval(expression.replace("L", lastValue));
      returnValues.push(value);
    }
  } else if (expression.includes("#")) {
    const splitExp = expression.split("#");
    const prefix = parseInt(splitExp[0]);
    const suffix = parseInt(splitExp[1]);
    if (!isNaN(prefix) && !isNaN(suffix)) {
      returnValues.push(
        `${numberToReadable(suffix)} occurence of ${numberToReadable(
          prefix
        )} ${fieldName}`
      );
    } else {
      returnValues.push(expression + " Not Parsed");
    }
  } else if (expression.includes("/")) {
    const splitExpression = expression.split("/");
    const allowedValues = parseEachExpression(
      splitExpression[0],
      fieldName,
      fieldIndex
    );
    initialValue = allowedValues[0];
    const maxAllowedValue =
      allowedValues.length > 1
        ? allowedValues[allowedValues.length - 1]
        : EXPRESSION_MAXVAL_MAP[fieldName];
    while (initialValue <= maxAllowedValue) {
      returnValues.push(initialValue);
      initialValue = parseInt(initialValue) + parseInt(splitExpression[1]);
    }
  } else if (expression.includes("-")) {
    const splitExpression = expression.split("-");
    initialValue = splitExpression[0].trim().toUpperCase();
    const finalValue = splitExpression[1].trim().toUpperCase();
    if (fieldName === "Month" && MONTHS.includes(initialValue)) {
      const currentIndex = MONTHS.indexOf(initialValue);
      const lastIndex = MONTHS.indexOf(finalValue);
      while (currentIndex <= lastIndex) {
        returnValues.push(MONTHS[initialValue++]);
      }
    } else if (fieldName === "Day of week" && WEEKS.includes(initialValue)) {
      let currentIndex = WEEKS.indexOf(initialValue);
      const lastIndex = WEEKS.indexOf(finalValue);
      while (currentIndex <= lastIndex) {
        returnValues.push(WEEKS[currentIndex++]);
      }
    } else {
      while (initialValue <= finalValue) {
        returnValues.push(initialValue++);
      }
    }
  } else if (expression.includes(",")) {
    returnValues.push(...expression.split(","));
  } else {
    returnValues.push(expression.trim().toUpperCase());
  }
  return returnValues;
};

/**
 * Function that takes full expresion, splits into individual fields and parses each field to print result
 * @param {*} expression Full cron expression
 */
const parseExpression = (expression) => {
  expression.forEach((element, i) => {
    let printFieldName = Object.keys(EXPRESSION_MAXVAL_MAP)[i];
    const values =
      i === expression.length - 1
        ? element
        : parseEachExpression(element, printFieldName, i).join(" ");

    const spacesRequired = FIELD_NAME_LENGTH - printFieldName.length + 1;
    printFieldName = printFieldName + new Array(spacesRequired).join(" ");
    console.log(printFieldName + values);
  });
};

// Run via command line - inputExpression received from command args
if (inputExpression && inputExpression.length >= 5) {
  parseExpression(inputExpression);
}

// Run via import / require
const parseCronExpression = (expression) => {
  parseExpression(expression.split(" "));
};

module.exports = parseCronExpression;
