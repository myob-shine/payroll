import { Injectable } from '@angular/core';
import { Http, HttpParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaxService {
    constructor(private http:Http) {
    }

    getIncomeTax(taxableIncome: number) {
        return this.http.get('http://localhost:3001/api/tax?taxableIncome=' + taxableIncome)
            .map(response => response.json());
    }
}