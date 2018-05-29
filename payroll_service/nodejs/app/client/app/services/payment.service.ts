import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PaymentService {
    constructor(private http:Http) {
        // console.log('Payments service initialised...');
    }

    getPayments() {
        return this.http.get('api/payments')
            .map(response => response.json());
    }

    savePayment(newPayment: any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/payment', JSON.stringify(newPayment), {headers: headers})
            .map(response => response.json());
    }

    viewPayment(payment: any) {
        return this.http.get('/api/payment/' + payment._id)
            .map(response => response.json());
    }
    
    deletePayment(id: any) {
        return this.http.delete('/api/payment/' + id)
            .map(response => response.json());
    } 
}