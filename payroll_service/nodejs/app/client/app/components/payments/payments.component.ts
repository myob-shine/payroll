import { Component } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { TaxService } from '../../services/tax.service';
import { Payment } from '../../../Payment';

@Component({
  moduleId: module.id,
  selector: 'payments',
  templateUrl: 'payments.component.html',
  providers: [PaymentService, TaxService]
})
export class PaymentsComponent {
    maxId: number;
    firstName: string;
    lastName: string;
    superRate: number;
    annualSalary: number;

    payslip: Payslip;
    payments: Payment[];    
    showPayslip = false;

    constructor(private paymentService: PaymentService, private taxService: TaxService) {
        this.payslip = null;
        this.maxId = 0;
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
        this.maxId = this.maxId + 1;

        this.payslip = new Payslip();
        this.payslip.isNew = true;
        this.payslip._id = this.maxId;
        this.payslip.firstName = this.capitaliseWord(this.firstName);
        this.payslip.lastName = this.capitaliseWord(this.lastName);
        this.payslip.annualSalary = this.annualSalary;
        this.payslip.superRate = this.superRate;

        // Calculate
        this.payslip.payPeriod =  new Date(); //this.getPayPeriod(new Date());
        this.payslip.payPeriodMonth = this.getPayPeriodMonth(this.payslip.payPeriod);
        this.payslip.payPeriodFormatted = this.getPayPeriodFormatted(this.payslip.payPeriod);
        this.payslip.grossIncome = this.calculateGrossIncome(this.payslip.annualSalary); 
        this.calculateIncomeTax(this.payslip.annualSalary);
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
            for (var i = 0; i < payments.length; i++) {
                if (payments[i]._id == id) {
                    payments.splice(i, 1);
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

    calculateIncomeTax(taxableIncome: number) : number {
        this.taxService.getIncomeTax(taxableIncome)
            .subscribe(incomeTax => {
                this.payslip.incomeTax = incomeTax.incomeTax;
                this.payslip.netIncome =  this.calculateNetIncome(this.payslip.grossIncome, this.payslip.incomeTax);
                this.payslip.super = this.calculateSuper(this.payslip.grossIncome, this.payslip.superRate);
                this.payslip.pay = this.calculatePay(this.payslip.netIncome, this.payslip.super);

                this.showPayslip = true;
                this.clearEmployeeInfo();
            });
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
    _id: number;
}