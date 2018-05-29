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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var PaymentService = (function () {
    function PaymentService(http) {
        this.http = http;
        // console.log('Payments service initialised...');
    }
    PaymentService.prototype.getPayments = function () {
        return this.http.get('api/payments')
            .map(function (response) { return response.json(); });
    };
    PaymentService.prototype.savePayment = function (newPayment) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/payment', JSON.stringify(newPayment), { headers: headers })
            .map(function (response) { return response.json(); });
    };
    PaymentService.prototype.viewPayment = function (payment) {
        return this.http.get('/api/payment/' + payment._id)
            .map(function (response) { return response.json(); });
    };
    PaymentService.prototype.deletePayment = function (id) {
        return this.http.delete('/api/payment/' + id)
            .map(function (response) { return response.json(); });
    };
    PaymentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PaymentService);
    return PaymentService;
}());
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map