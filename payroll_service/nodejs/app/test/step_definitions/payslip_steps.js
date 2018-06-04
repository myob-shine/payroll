const expect = require('chai').expect;

module.exports = function () {

    this.When(/^I generate a payslip for a new employee$/, function () {
        return helpers.loadPage(page.payroll.url)
            .then( () => {
                return page.payroll.enterNewEmployeeDetails("John", "Snow", "81900", "9")
        })
    });

    this.Then(/^I should see the payslip summary page$/, function () {
        return driver.wait(until.elementsLocated(page.payslip.elements.payslipForm), 10000)
            .then( () => {
                driver.findElement(page.payslip.elements.employeeName).getText()
                .then(t => {
                    expect(t).to.be.eql("John Snow");
                })
            })
            .then( () => {
                driver.findElement(page.payslip.elements.annualIncome).getText()
                    .then(t => {
                        expect(t).to.be.eql("$81,900.00");
                })
            })
            .then( () => {
                driver.findElement(page.payslip.elements.super).getText()
                    .then(t => {
                        expect(t).to.be.eql("$614.00");
                })
            });
    });
};