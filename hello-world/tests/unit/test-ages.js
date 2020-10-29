'use strict';

const ages = require('../../EligibleAges.js');
const chai = require('chai');
const expect = chai.expect;

let birthDate = new Date(1956, 10, 3);
let birthYear = birthDate.getFullYear();

describe('Test full age', function () {
    it('verify full age response', () => {
        const fullPeriod = ages.getPeriodForYear(birthYear);
        expect(fullPeriod.years).to.equal(66);
        expect(fullPeriod.months).to.equal(4);
    });
    it('verify full age date', () => {
        const fullDate = ages.getFullDate(birthDate);
        expect(fullDate.getFullYear()).to.equal(2023);
        expect(fullDate.getMonth()).to.equal(2);
    });
});
