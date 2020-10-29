'use strict'

const df = require('date-fns');

const earlyAgePeriod = { 'years': 62, 'months': 0 };
const delayedAgePeriod = { 'years': 70, 'months': 0 };
const first36Multiplier = 0.05 / 9;
const over36Multiplier = 0.05 / 12;
const reductionMonths = 36;

/* eligible ages for full retirement */
const fullAgeMap = new Map([
    [ 1900, { 'years': 65, 'months': 0 } ],
    [ 1937, { 'years': 65, 'months': 0 } ],
    [ 1938, { 'years': 65, 'months': 2 } ],
    [ 1939, { 'years': 65, 'months': 4 } ],
    [ 1940, { 'years': 65, 'months': 6 } ],
    [ 1941, { 'years': 65, 'months': 8 } ],
    [ 1942, { 'years': 65, 'months': 10 } ],
    [ 1943, { 'years': 66, 'months': 0 } ],
    [ 1955, { 'years': 66, 'months': 2 } ],
    [ 1956, { 'years': 66, 'months': 4 } ],
    [ 1957, { 'years': 66, 'months': 6 } ],
    [ 1958, { 'years': 66, 'months': 8 } ],
    [ 1959, { 'years': 66, 'months': 10 } ],
    [ 1960, { 'years': 67, 'months': 0 } ],
    [ 2000, { 'years': 67, 'months': 0 } ]
]);

/* increase multiplier for delayed retirement */
const increaseMultiplierMap = new Map( [
    [ 1900, 0.0 ],
    [ 1917, 0.03 ],
    [ 1925, 0.035 ],
    [ 1927, 0.04 ],
    [ 1929, 0.045 ],
    [ 1931, 0.05 ],
    [ 1933, 0.055 ],
    [ 1935, 0.06 ],
    [ 1937, 0.065 ],
    [ 1939, 0.07 ],
    [ 1941, 0.075 ],
    [ 1943, 0.08 ],
    [ 2000, 0.08 ]
]);

/* variables for calculation */
let dateOfBirth, earlyDate, fullDate, delayedDate;

/* get full retirement period for birth year */
exports.getPeriodForYear = (birthYear) => {
    let result;

    fullAgeMap.forEach((period, year) => {
        if (year <= birthYear) {
            result = period;
        }
    });

    return result;
}

exports.getEarlyDate = (birthDate) => {
    return df.add(birthDate, earlyAgePeriod);
}

exports.getFullDate = (birthDate) => {
    let fullAgePeriod = this.getPeriodForYear(birthDate.getFullYear());
    return df.add(birthDate, fullAgePeriod);
}

exports.getDelayedDate = (birthDate) => {
    return df.add(birthDate, delayedAgePeriod);
}
