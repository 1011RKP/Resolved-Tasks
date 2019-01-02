import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json;odata=verbose' })
};

@Injectable()
export class AppService {
    RequestDigest: string;

    constructor(
        private _http: HttpClient) 
        { }

    getData(url: string): Observable<any> {
        const httpURL = url;
        //console.log(httpURL);
        return this._http.get(httpURL, httpOptions)
            .pipe(
                tap(data => this.log('fetched Data')),
                catchError(this.handleError('getListItem', []))
            );
    }


    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error('Verbose Logging'); // log to console instead
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    private log(message: string) {
        // console.log('AppService: ' + message);
    }

    public exportAsExcelFile(json: any[], excelFileName: string): void {
    
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet',worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
      }
    
      private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }

}
