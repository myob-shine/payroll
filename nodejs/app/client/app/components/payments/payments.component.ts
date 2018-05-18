import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../../Payment';

@Component({
  moduleId: module.id,
  selector: 'payments',
  templateUrl: 'payments.component.html',
  providers: [PaymentService]
})
export class PaymentsComponent { 
    firstName: string;
    lastName: string;
    superRate: number;
    annualSalary: number;

    payslip: Payslip;
    payments: Payment[];    
    showPayslip = false;

    constructor(private paymentService: PaymentService) {
        this.payslip = null;
        this.paymentService.getPayments()
            .subscribe(payments => {
                this.payments = payments;
                this.payments.forEach(payment => {
                    payment.payPeriodMonth = this.getPayPeriodMonth(payment.payPeriod);
                });
            });   
    }

    clearEmployeeInfo() {
        this.firstName = null;
        this.lastName = null;
        this.annualSalary = null;
        this.superRate = null;
    }

    hidePayslip() {
        this.payslip = null;
        this.showPayslip = false;
        this.clearEmployeeInfo();
    }

    capitaliseWord(word: string) : string {
        if (!word) {
            return '';
        } 
        
        var input = word.trim();
        if (input.length < 2) {
            return input.charAt(0).toUpperCase().trim();
        }
        return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }

    // Calculate new employee payslip
    generatePayslip(event: any) {         
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
        this.payslip.payPeriod =  new Date(); //this.getPayPeriod(new Date());
        this.payslip.payPeriodMonth = this.getPayPeriodMonth(this.payslip.payPeriod);
        this.payslip.payPeriodFormatted = this.getPayPeriodFormatted(this.payslip.payPeriod);
        this.payslip.grossIncome = this.calculateGrossIncome(this.payslip.annualSalary); 
        this.payslip.incomeTax = this.calculateIncomeTax(this.payslip.annualSalary);  
        this.payslip.netIncome =  this.calculateNetIncome(this.payslip.grossIncome, this.payslip.incomeTax);
        this.payslip.super = this.calculateSuper(this.payslip.grossIncome, this.payslip.superRate);
        this.payslip.pay = this.calculatePay(this.payslip.netIncome, this.payslip.super);

        this.showPayslip = true;
        this.clearEmployeeInfo();
    }

    // Save new employee payment
    savePayment() {        
        if (!this.payslip || !this.payslip.isNew) {
            return;
        }

        this.paymentService.savePayment(this.payslip)
            .subscribe(payment => {
                this.payments.push(payment);
                this.hidePayslip();
            });
    }

    // View existing employee payment
    viewPayment(payment: any) {
        this.paymentService.viewPayment(payment)
            .subscribe(payment => {
                this.payslip = payment;
                this.payslip.isNew = false;
                this.payslip.payPeriodFormatted = this.getPayPeriodFormatted(this.payslip.payPeriod);
                this.showPayslip = true;
            });            
    }

    // Remove existing employee payment
    deletePayment(id: any) {
        var payments = this.payments;
        this.paymentService.deletePayment(id).subscribe(data => {
            if (data.n == 1) {
                for (var i = 0; i < payments.length; i++) {
                    if (payments[i]._id == id) {
                        payments.splice(i, 1);
                    }
                }
            }
        }); 
    }

    getPayPeriodMonth(date: Date) : string {
        if (!date) {
            date = new Date();
        } else {
            date = new Date(date);
        }    

        var months = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];  
        return 'Month of ' +  months[date.getMonth()];
    }

    getPayPeriodFormatted(date: Date) : string {
        if (!date) {
            date = new Date();
        } else {
            date = new Date(date);
        }           

        var currentDate = new Date(),
        locale = "en-au",
        day = date.toLocaleString(locale, { day: "numeric" }), 
        month = date.toLocaleString(locale, { month: "long" }), 
        year = date.toLocaleString(locale, { year: "numeric" });       
        return day + ' ' +  month + ' ' + year; 
    }

    calculateGrossIncome(annualSalary: number) : number {
        return Math.round(annualSalary / 12);
    }

    /*
        Source: https://www.ato.gov.au/Rates/Individual-income-tax-for-prior-years/
        0 – $18,200         Nil
        $18,201 – $37,000   19c for each $1 over $18,200
        $37,001 – $80,000   $3,572 plus 32.5c for each $1 over $37,000
        $80,001 – $180,000  $17,547 plus 37c for each $1 over $80,000
        $180,001 and over   $54,547 plus 45c for each $1 over $180,000
    */
    calculateIncomeTax(taxableIncome: number) : number {
        var taxRate: number = 0;
        var taxAmount: number = 0;
        var taxThreshold: number = 0;

        if (taxableIncome === 0 || (taxableIncome > 0 && taxableIncome <= 18200)) {
            return 0;
        } else if (taxableIncome > 18200 && taxableIncome <= 37000) {
            taxRate = 0.19;
            taxAmount = 0;
            taxThreshold = 18200;
        } else if (taxableIncome > 37000 && taxableIncome <= 80000) {
            taxRate = 0.325;
            taxAmount = 3572;
            taxThreshold = 37000;
        } else if (taxableIncome > 80000 && taxableIncome <= 180000) {
            taxRate = 0.37;
            taxAmount = 17547;
            taxThreshold = 80000;
        } else if (taxableIncome > 180000) {
            taxRate = 0.45;
            taxAmount = 54547;
            taxThreshold = 180000;
        }

        return Math.round((taxAmount + (Math.max(0, taxableIncome - taxThreshold)) * taxRate) / 12);
    }

    calculateNetIncome(grossIncome: number, incomeTax: number) : number {        
        return Math.max(0, grossIncome - incomeTax);
    }

    calculateSuper(grossIncome: number, superRate: number) : number {
        return Math.round(grossIncome * superRate / 100);
    }

    calculatePay(netIncome: number, superAmount: number) : number {
        return Math.max(0, netIncome - superAmount);
    }
}

export class Payslip implements Payment {
    firstName: string;
    lastName: string;
    annualSalary: number;
    superRate: number;
    payPeriod: Date;
    payPeriodMonth: string;
    payPeriodFormatted: string;
    grossIncome: number;
    incomeTax: number;
    netIncome: number;
    super: number;
    pay: number;
    isNew: boolean;
}