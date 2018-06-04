import { Component } from '@angular/core';
import { PaymentService } from './services/payment.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  providers: [PaymentService]
})
export class AppComponent { }