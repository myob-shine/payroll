import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';
import { PaymentsComponent } from './components/payments/payments.component';

@NgModule({
imports:      [ BrowserModule, HttpModule, FormsModule ],
declarations: [ AppComponent, PaymentsComponent ],
bootstrap:    [ AppComponent ]
})
export class AppModule { }