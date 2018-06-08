module.exports = {
    url: 'http://localhost',
    elements: {
        employeeForm: by.name('employeeForm'),
        firstNameInput: by.name('firstName'),
        lastNameInput: by.name('lastName'),
        annualSalaryInput: by.name('annualSalary'),
        superRateInput: by.name('superRate'),
        generatePayslipButton: by.css('button.btn-primary')
    },


    enterNewEmployeeDetails: function (firstName, lastName, annualSalary, superRate) {
        driver.wait(until.elementsLocated(this.elements.employeeForm), 10000)
        driver.findElement(this.elements.firstNameInput).sendKeys(firstName);
        driver.findElement(this.elements.lastNameInput).sendKeys(lastName);
        driver.findElement(this.elements.annualSalaryInput).sendKeys(annualSalary);
        driver.findElement(this.elements.superRateInput).sendKeys(superRate);
        driver.findElement(this.elements.generatePayslipButton).click();
    }
};