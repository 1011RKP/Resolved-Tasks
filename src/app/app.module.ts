import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'; 
import { NgxPaginationModule } from 'ngx-pagination';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot() 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// ng build --deploy-url https://incytedev.sharepoint.com/sites/EHSMMS/SiteAssets/ApplicationCode/Reports/Resolved/ --base-href https://incytedev.sharepoint.com/sites/EHSMMS/Pages/Resolved.aspx

// npm i ngx-bootstrap (Date Time Picker)
// npm i moment (Moment for Date Time)
// npm i ngx-pagination (Pagination for Table)
// npm i file-saver (File server to export date to Excel)
// npm i xlsx (Excel Service to export date to Excel)