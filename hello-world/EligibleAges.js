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

/* get full retirement period for birth year */
exports.getPeriodForYear = (birthYear) => {
    let result = { 'years': 0, 'months': 0 };

    fullAgeMap.forEach((period, year) => {
        if (year <= birthYear) {
            result = period;
        }
    });

    return result;
}

/* get increase multiplier for birth year */
exports.getIncreaseMultiplier = (birthYear) => {
    let result = 0.0;

    increaseMultiplierMap.forEach((multiplier, year) => {
        if (year <= birthYear) {
            result = multiplier;
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

exports.calcEarlyReduction = (birthDate, retireDate) => {
    let reduction = 0.0;
    let fullDate = this.getFullDate(birthDate);
    let earlyDate = this.getEarlyDate(birthDate);

    if (df.isBefore(retireDate, earlyDate)) {
        // 100% reduction
        reduction = 1.0;
    } else if (df.isAfter(retireDate, fullDate)) {
        // no reduction
        reduction = 0.0;
    } else {
        // partial reduction
        let months = df.differenceInMonths(fullDate, retireDate);
        if (months < reductionMonths) {
            // up to 36 months * multiplier
            reduction = months * first36Multiplier;
        } else {
            // over 36 months * multiplier
            reduction = reductionMonths * first36Multiplier + (months - reductionMonths) * over36Multiplier;
        }
    }

    return reduction;
}

exports.calcDelayIncrease = (birthDate, retireDate) => {
    let increase = 0.0;
    let fullDate = this.getFullDate(birthDate);
    let delayedDate = this.getDelayedDate(birthDate);
    let yearOfBirth = birthDate.getFullYear();
    let increaseMultiplier = this.getIncreaseMultiplier(yearOfBirth);

    if (df.isBefore(retireDate, fullDate)) {
        // no increase
        increase = 0.0;
    } else if (df.isBefore(retireDate, delayedDate)) {
        // partial increase
        let months = df.differenceInMonths(retireDate, fullDate);
        increase = (months / 12.0) * increaseMultiplier;
    } else {
        // capped increase
        let months = df.differenceInMonths(delayedDate, fullDate);
        increase = (months / 12.0) * increaseMultiplier;
    }

    return increase;
}

exports.calcTotalAdjustment = (birthDate, retireDate) => {
    let adjustment = 1.0
        - this.calcEarlyReduction(birthDate, retireDate)
        + this.calcDelayIncrease(birthDate, retireDate);

    return adjustment;
}
