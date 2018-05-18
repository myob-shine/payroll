"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var payment_service_1 = require('../../services/payment.service');
var PaymentsComponent = (function () {
    function PaymentsComponent(paymentService) {
        var _this = this;
        this.paymentService = paymentService;
        this.showPayslip = false;
        this.payslip = null;
        this.paymentService.getPayments()
            .subscribe(function (payments) {
            _this.payments = payments;
            _this.payments.forEach(function (payment) {
                payment.payPeriodMonth = _this.getPayPeriodMonth(payment.payPeriod);
            });
        });
    }
    PaymentsComponent.prototype.clearEmployeeInfo = function () {
        this.firstName = null;
        this.lastName = null;
        this.annualSalary = null;
        this.superRate = null;
    };
    PaymentsComponent.prototype.hidePayslip = function () {
        this.payslip = null;
        this.showPayslip = false;
        this.clearEmployeeInfo();
    };
    PaymentsComponent.prototype.capitaliseWord = function (word) {
        if (!word) {
            return '';
        }
        var input = word.trim();
        if (input.length < 2) {
            return input.charAt(0).toUpperCase().trim();
        }
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
    // Calculate new employee payslip
    PaymentsComponent.prototype.generatePayslip = function (event) {
        event.preventDefault();
        // Validate employee details
        if (!this.firstName || !this.lastName || !this.annualSalary || !this.superRate ||
            this.firstName.length === 0 || this.lastName.length === 0 ||
            this.annualSalary === 0 || this.superRate === 0) {
            return;
        }
        // Generate new payslip
        this.payslip = new Payslip();
        this.payslip.isNew = true;
        this.payslip.firstName = this.capitaliseWord(this.firstName);
        this.payslip.lastName = this.capitaliseWord(this.lastName);
        this.payslip.annualSalary = this.annualSalary;
        this.payslip.superRate = this.superRate;
        // Calculate
        this.payslip.payPeriod = new Date(); //this.getPayPeriod(new Date());
        this.payslip.payPeriodMonth = this.getPayPeriodMonth(this.payslip.payPeriod);
        this.payslip.payPeriodFormatted = this.getPayPeriodFormatted(this.payslip.payPeriod);
        this.payslip.grossIncome = this.calculateGrossIncome(this.payslip.annualSalary);
        this.payslip.incomeTax = this.calculateIncomeTax(this.payslip.annualSalary);
        this.payslip.netIncome = this.calculateNetIncome(this.payslip.grossIncome, this.payslip.incomeTax);
        this.payslip.super = this.calculateSuper(this.payslip.grossIncome, this.payslip.superRate);
        this.payslip.pay = this.calculatePay(this.payslip.netIncome, this.payslip.super);
        this.showPayslip = true;
        this.clearEmployeeInfo();
    };
    // Save new employee payment
    PaymentsComponent.prototype.savePayment = function () {
        var _this = this;
        if (!this.payslip || !this.payslip.isNew) {
            return;
        }
        this.paymentService.savePayment(this.payslip)
            .subscribe(function (payment) {
            _this.payments.push(payment);
            _this.hidePayslip();
        });
    };
    // View existing employee payment
    PaymentsComponent.prototype.viewPayment = function (payment) {
        var _this = this;
        this.paymentService.viewPayment(payment)
            .subscribe(function (payment) {
            _this.payslip = payment;
            _this.payslip.isNew = false;
            _this.payslip.payPeriodFormatted = _this.getPayPeriodFormatted(_this.payslip.payPeriod);
            _this.showPayslip = true;
        });
    };
    // Remove existing employee payment
    PaymentsComponent.prototype.deletePayment = function (id) {
        var payments = this.payments;
        this.paymentService.deletePayment(id).subscribe(function (data) {
            if (data.n == 1) {
                for (var i = 0; i < payments.length; i++) {
                    if (payments[i]._id == id) {
                        payments.splice(i, 1);
                    }
                }
            }
        });
    };
    PaymentsComponent.prototype.getPayPeriodMonth = function (date) {
        if (!date) {
            date = new Date();
        }
        else {
            date = new Date(date);
        }
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return 'Month of ' + months[date.getMonth()];
    };
    PaymentsComponent.prototype.getPayPeriodFormatted = function (date) {
        if (!date) {
            date = new Date();
        }
        else {
            date = new Date(date);
        }
        var currentDate = new Date(), locale = "en-au", day = date.toLocaleString(locale, { day: "numeric" }), month = date.toLocaleString(locale, { month: "long" }), year = date.toLocaleString(locale, { year: "numeric" });
        return day + ' ' + month + ' ' + year;
    };
    PaymentsComponent.prototype.calculateGrossIncome = function (annualSalary) {
        return Math.round(annualSalary / 12);
    };
    /*
        Source: https://www.ato.gov.au/Rates/Individual-income-tax-for-prior-years/
        0 – $18,200         Nil
        $18,201 – $37,000   19c for each $1 over $18,200
        $37,001 – $80,000   $3,572 plus 32.5c for each $1 over $37,000
        $80,001 – $180,000  $17,547 plus 37c for each $1 over $80,000
        $180,001 and over   $54,547 plus 45c for each $1 over $180,000
    */
    PaymentsComponent.prototype.calculateIncomeTax = function (taxableIncome) {
        var taxRate = 0;
        var taxAmount = 0;
        var taxThreshold = 0;
        if (taxableIncome === 0 || (taxableIncome > 0 && taxableIncome <= 18200)) {
            return 0;
        }
        else if (taxableIncome > 18200 && taxableIncome <= 37000) {
            taxRate = 0.19;
            taxAmount = 0;
            taxThreshold = 18200;
        }
        else if (taxableIncome > 37000 && taxableIncome <= 80000) {
            taxRate = 0.325;
            taxAmount = 3572;
            taxThreshold = 37000;
        }
        else if (taxableIncome > 80000 && taxableIncome <= 180000) {
            taxRate = 0.37;
            taxAmount = 17547;
            taxThreshold = 80000;
        }
        else if (taxableIncome > 180000) {
            taxRate = 0.45;
            taxAmount = 54547;
            taxThreshold = 180000;
        }
        return Math.round((taxAmount + (Math.max(0, taxableIncome - taxThreshold)) * taxRate) / 12);
    };
    PaymentsComponent.prototype.calculateNetIncome = function (grossIncome, incomeTax) {
        return Math.max(0, grossIncome - incomeTax);
    };
    PaymentsComponent.prototype.calculateSuper = function (grossIncome, superRate) {
        return Math.round(grossIncome * superRate / 100);
    };
    PaymentsComponent.prototype.calculatePay = function (netIncome, superAmount) {
        return Math.max(0, netIncome - superAmount);
    };
    PaymentsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'payments',
            templateUrl: 'payments.component.html',
            providers: [payment_service_1.PaymentService]
        }), 
        __metadata('design:paramtypes', [payment_service_1.PaymentService])
    ], PaymentsComponent);
    return PaymentsComponent;
}());
exports.PaymentsComponent = PaymentsComponent;
var Payslip = (function () {
    function Payslip() {
    }
    return Payslip;
}());
exports.Payslip = Payslip;
//# sourceMappingURL=payments.component.js.map