import { Component } from '@angular/core';
import { Building, Floor, Locations, Departments, Persons, Reports } from './data';
import { AppService } from './app.service';
import { AppSettings } from './app.global';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AppService, AppSettings]
})

export class AppComponent {
  title = 'app';
  allBuilings: Building[];
  allLocations: Locations[];
  allFloors: Floor[];
  allDepartments: Departments[];
  allPersons: Persons[];
  allReports: Reports[];
  selectedBuilding: Building = null;
  selectedLocation: Locations = null;
  selectedFloor: Floor = null;
  selectedDepartment: Departments = null;
  selectedPerson: Persons = null;
  imagePath: string = this._global.gifLocation;
  showGIF: string = ''; shoewTable: string = '';
  dateRange; workflowTasks = []; workflowTasksFinal = [];
  arcWorkflowTasks = []; arcWorkflowTasksFinal = [];
  toDate: any; fromDate: any; manipulatedDate: any;
  bsRangeValue: Date[]; finalWorkflowURL: string; finalArcWorkflowURL: string;
  sLocation: string; sBuilding: string;
  excelObj = []; excelBtn: string = ''; filterLength;
  rdepartmentName: string; rpersonName: string; rBuildingName: string; rFloorName: string; rlocationName: string;
  rdepartment: string; rperson: string; rBuilding: string; rFloor: string; rlocation: string;
  fdepartment: string; fperson: string; fBuilding: string; fFloor: string; flocation: string;

  noData: string = ''; df: Date; ft: Date;

  filterInputs = []; filterQuery;

  url: string;
  public dateTimeRange: Date[];

  bsConfig: Partial<BsDatepickerConfig>;
  constructor(
    private _appService: AppService,
    private _global: AppSettings) {
    this.bsConfig = Object.assign({},
      {
        containerClass: 'theme-dark-blue'
      });
  }


  ngOnInit() {
    this.getDepartments();
    this.getBuilings();
  }

  EHSMMSReports(dateSlected): void {
    if (dateSlected != undefined) {
      const dateFrom = new Date(moment(dateSlected[0]).format("MM/DD/YYYY"));
      this.fromDate = dateFrom.toISOString();
      const ManpDate = moment(dateSlected[1]).format("MM/DD/YYYY");
      this.manipulatedDate = moment(ManpDate).add(23, 'hours').add(59, 'minutes');
      this.toDate = this.manipulatedDate.toISOString();
    }
    else {
      this.fromDate = null;
      this.toDate = null;
    }
    this.noData = "Data Not";
    this.filterInputs = [];
    this.fdepartment = ((this.rdepartment != null) ? '(DepartmentsId eq \'' + this.rdepartment + '\')' : '');
    this.fperson = ((this.rperson != null) ? '(AssignedToId eq \'' + this.rperson + '\')' : '');
    this.fBuilding = ((this.rBuilding != null) ? '(BuildingId eq \'' + this.rBuilding + '\')' : '');
    this.fFloor = ((this.rFloor != null) ? '(FloorId eq \'' + this.rFloor + '\')' : '');
    this.flocation = ((this.rlocation != null) ? '(LocationId eq \'' + this.rlocation + '\')' : '');
    this.dateRange = ((dateSlected != undefined) ? '(StartDate ge \'' + this.fromDate + '\') and ' + '(StartDate le \'' + this.toDate + '\')' : '');
    this.filterInputs.push(this.fdepartment, this.fperson, this.fBuilding, this.fFloor, this.flocation, this.dateRange)
    this.filterInputs = this.filterInputs.filter(function (el) {
      return el != "";
    });
    this.filterLength = this.filterInputs.length;
    this.filterQuery = this.filterInputs.join(" and ");
    this.filterQuery = (((this.filterLength) > 0) ? this.filterQuery + " and (WorkflowStatus eq 'Closed')" : "(WorkflowStatus eq 'Closed')");
    console.log(this.filterQuery);
    this.showGIF = 'Show'; this.excelBtn = "Hide";
    const select = this._global.select_WorkflowTasks;
    const Orderby = this._global.orderby_WorkflowTasks;
    const filter = '&$filter=' + this.filterQuery;
    this.workflowTasksFinal = [];
    this.arcWorkflowTasksFinal = [];
    this.finalWorkflowURL = this._global.siteURL + "/_api/web/lists/getbytitle(\'Workflow Tasks\')/items" + select + Orderby + filter;
    this.finalArcWorkflowURL = this._global.siteURL + "/_api/web/lists/getbytitle(\'arc_WorkflowTasks\')/items" + select + Orderby + filter;
    this.IttarativeDataWorkflow(this.finalWorkflowURL);
  }

  IttarativeDataWorkflow(url) {
    this._appService.getData(url)
      .subscribe(
        (data) => {
          if (data.d.results.length > 0) {
            this.workflowTasks = [];
            let rep = data.d.results;
            this.workflowTasks = rep;
            this.workflowTasksFinal = this.workflowTasksFinal.concat(this.workflowTasks);
            if (data.d.__next) {
              this.IttarativeDataWorkflow(data.d.__next);
            }
            else {
              console.log(this.workflowTasksFinal);
              let arcURL = this.finalArcWorkflowURL;
              this.IttarativeDataArcWorkflow(arcURL);
            }
          }
          else {
            let arcURL = this.finalArcWorkflowURL;
            this.IttarativeDataArcWorkflow(arcURL);
          }

        });
  }

  IttarativeDataArcWorkflow(arcURL) {
    this._appService.getData(arcURL)
      .subscribe(
        (data) => {
          let FinalReports = [];
          if (data.d.results.length > 0) {
            this.arcWorkflowTasks = [];
            let rep = data.d.results;
            this.arcWorkflowTasks = rep
            this.arcWorkflowTasksFinal = this.arcWorkflowTasksFinal.concat(this.arcWorkflowTasks);
            if (data.d.__next) {
              this.IttarativeDataArcWorkflow(data.d.__next);
            }
            else {
              FinalReports = this.arcWorkflowTasksFinal.concat(this.workflowTasksFinal);
              this.allReports = <Reports[]>FinalReports;
              this.showGIF = '';
              this.shoewTable = 'Show';
              this.noData = "Data Existed";
              this.BuildExcelObj(FinalReports);
            }
          } else {
            if (this.workflowTasksFinal.length > 0) {
              FinalReports = this.arcWorkflowTasksFinal.concat(this.workflowTasksFinal);
              this.allReports = <Reports[]>FinalReports;
              this.noData = "Data Existed";
              this.showGIF = '';
              this.shoewTable = 'Show';
              this.BuildExcelObj(FinalReports);

            } else {
              this.noData = "Data Not Existed"
              this.showGIF = '';
            }
          }
        });
  }

  BuildExcelObj(d) {
    const excelReports = [];
    for (let i = 0; i < d.length; i++) {
      let Obj = {
        // DateFrom: this.fromDate,
        // DateTo: this.toDate,
        Department: d[i].Departments.Department,
        Person: d[i].AssignedTo.Title,
        Building: d[i].Building.BuildingName,
        Floor: d[i].Floor.FloorName,
        Location: d[i].Location.LocationName,
        Question: d[i].Question,
        Answer: d[i].Answer,
        PossibleFineAmount: d[i].PossibleFineAmount,
        Regulation: d[i].Regulation,
        Assigned: d[i].AssignedTo.Title,
        InspectionType: d[i].InspectionType,
      }
      excelReports.push(Obj);
    }
    this.excelObj = excelReports;
    this.excelBtn = 'Show';
    this.noData = "Data Existed"
  }

  ExporttoExcel(excelObj) {
    this._appService.exportAsExcelFile(excelObj, 'Resolved Task Reports');
  }

  // gets all Builings.
  getBuilings(): void {
    const select = this._global.select_Building;
    const Orderby = this._global.orderby_Building;
    const filter = '&$filter=(Status eq \'Active\')';
    const url = this._global.siteURL + "/_api/web/lists/getbytitle(\'md_lkp_Buildings\')/items" + select + Orderby + filter;
    this._appService.getData(url)
      .subscribe(
        (data) => {
          if (data) {
            data = data.d.results;
            this.allBuilings = <[Building]>data;
            this.selectedBuilding = null;
          }
        });
  }

  // gets all Floors.
  getFloors(selectedBuilding: Building): void {
    if (selectedBuilding != null) {
      this.rBuilding = selectedBuilding.Id;
      this.rBuildingName = selectedBuilding.BuildingName;
      //console.log("Slected Building:-" + " " + this.rBuilding + selectedBuilding);
      const select = this._global.select_Floors;
      const Orderby = this._global.orderby_Floors;
      const filter = '&$filter=BuildingId eq \'' + selectedBuilding.Id + '\' and (Status eq \'Active\')';
      const url = this._global.siteURL + "/_api/web/lists/getbytitle(\'md_lkp_Floors'\)/items" + select + Orderby + filter;
      this._appService.getData(url)
        .subscribe(
          (data) => {
            if (data) {
              data = data.d.results;
              this.allFloors = <Floor[]>data;
              this.selectedFloor = null;
            }
          });
    }
    else {
      this.rBuilding = null;
      this.rBuildingName = null;
    }

  }

  // gets all Locations.
  getLocations(selectedFloor: Floor): void {
    if (selectedFloor != null) {
      this.rFloor = selectedFloor.Id;
      this.rFloorName = selectedFloor.FloorName;
      //console.log("Slected Floor:-" + " " + this.rFloor + selectedFloor);
      const select = this._global.select_Location;
      const Orderby = this._global.orderby_Location;
      const filter = '&$filter=(FloorId eq ' + selectedFloor.Id + ')  and ' + '(Status eq \'Active\')';
      const url = this._global.siteURL + "/_api/web/lists/getbytitle(\'md_lkp_Locations\')/items?" + select + Orderby + filter;
      this._appService.getData(url)
        .subscribe(
          (data) => {
            if (data) {
              data = data.d.results;
              this.allLocations = <Locations[]>data;
              this.selectedLocation = null;
            }
            else {
              this.selectedLocation = null;
              this.allLocations = null;
            }
          });
    }
    else {
      this.rFloor = null
      this.rFloorName = null
    }

  }

  // gets all Departmnets.
  getDepartments(): void {
    const select = this._global.select_Departments;
    const Orderby = this._global.orderby_Departments;
    const filter = '&$filter=(Status eq \'Active\')';
    const url = this._global.siteURL + "/_api/web/lists/getbytitle(\'md_lkp_Departments\')/items" + select + Orderby + filter;
    this._appService.getData(url)
      .subscribe(
        (data) => {
          if (data) {
            data = data.d.results;
            this.allDepartments = <Departments[]>data;
            this.selectedDepartment = null;
          }
        });
  }


  // gets all Persons.
  getPersons(selectedDepartment: Departments): void {
    if (selectedDepartment != null) {
      this.rdepartment = selectedDepartment.Id;
      this.rdepartmentName = selectedDepartment.Department;
      //console.log("Slected Departments:-" + " " + this.rdepartment + selectedDepartment);
      const select = this._global.select_Users;
      const Orderby = this._global.orderby_Users;
      const filter = '&$filter=DepartmentId eq \'' + selectedDepartment.Id + '\' and (Status eq \'Active\')';
      const url = this._global.siteURL + "/_api/web/lists/getbytitle(\'md_Users'\)/items" + select + Orderby + filter;
      this._appService.getData(url)
        .subscribe(
          (data) => {
            if (data) {
              data = data.d.results;
              this.allPersons = <Persons[]>data;
              this.selectedPerson = null;
            }
          });
    }
    else {
      this.rdepartment = null;
      this.rdepartmentName = null;
    }

  }


  getSlectedPerson(selectedPerson: Persons): void {
    if (selectedPerson != null) {
      const filter = '&$filter=Title eq \'' + selectedPerson.Name + '\'';
      const url = this._global.siteURL + "/_api/web/SiteUserInfoList/items?$select=Id" + filter;
      this._appService.getData(url)
        .subscribe(
          (data) => {
            if (data.d.results.length > 0) {
              data = data.d.results;
              this.rperson = data[0].Id;
              this.rpersonName = selectedPerson.Name;
            }
            else {
              this.rperson = null;
              this.rpersonName = null;
            }
          });
    }
    else {
      this.rperson = null
      this.rpersonName = null
    }
  }

  getSlectedLocation(selectedLocation: Locations): void {
    if (selectedLocation != null) {
      this.rlocation = selectedLocation.Id;
      this.rlocationName = selectedLocation.LocationName;
      console.log("Slected Locations:-" + " " + this.rlocation + selectedLocation);
    }
    else {
      this.rlocation = null;
      this.rlocationName = null;
    }
  }

  SortByQuestion(a, b) {
    var aQuestion = a.Question.toLowerCase();
    var bQuestion = b.Question.toLowerCase();
    return ((aQuestion < bQuestion) ? -1 : ((aQuestion > bQuestion) ? 1 : 0));
  }

}