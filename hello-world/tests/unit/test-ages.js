'use strict';

const df = require('date-fns');

const ages = require('../../EligibleAges.js');
const chai = require('chai');
const expect = chai.expect;

let birthDate = new Date(1956, 10, 3);
let birthYear = birthDate.getFullYear();

describe('Test full age', function () {
    it('verify full age response', () => {
        let fullPeriod = ages.getPeriodForYear(birthYear);
        expect(fullPeriod.years).to.equal(66);
        expect(fullPeriod.months).to.equal(4);
    });
    it('verify full age date', () => {
        let fullDate = ages.getFullDate(birthDate);
        expect(fullDate.getFullYear()).to.equal(2023);
        expect(fullDate.getMonth()).to.equal(2);
    });
    it('verify no early reduction', () => {
        let fullDate = ages.getFullDate(birthDate);
        let reduction = ages.calcEarlyReduction(birthDate, fullDate);
        expect(reduction).to.equal(0.0);
    });
    it('verify early reduction', () => {
        let fullDate = ages.getFullDate(birthDate);
        let retireDate = df.subYears(fullDate, 1);
        const reduction = ages.calcEarlyReduction(birthDate, retireDate);
        expect(reduction).to.be.greaterThan(0.0);
    });
    it('verify no delay increase', () => {
        let fullDate = ages.getFullDate(birthDate);
        let increase = ages.calcDelayIncrease(birthDate, fullDate);
        expect(increase).to.equal(0.0);
    });
    it('verify delay increase', () => {
        let delayedDate = ages.getDelayedDate(birthDate);
        let retireDate = df.subYears(delayedDate, 1);
        let increase = ages.calcDelayIncrease(birthDate, retireDate);
        expect(increase).to.be.greaterThan(0.0);
    });
    it('verify no adjustment', () => {
        let fullDate = ages.getFullDate(birthDate);
        let adjustment = ages.calcTotalAdjustment(birthDate, fullDate);
        expect(adjustment).to.equal(1.0);
    });
    it('verify negative adjustment', () => {
        let fullDate = ages.getFullDate(birthDate);
        let retireDate = df.subYears(fullDate, 1);
        let adjustment = ages.calcTotalAdjustment(birthDate, retireDate);
        expect(adjustment).to.be.lessThan(1.0);
    });
    it('verify positive adjustment', () => {
        let fullDate = ages.getFullDate(birthDate);
        let retireDate = df.addYears(fullDate, 1);
        let adjustment = ages.calcTotalAdjustment(birthDate, retireDate);
        expect(adjustment).to.be.greaterThan(1.0);
    });
});
