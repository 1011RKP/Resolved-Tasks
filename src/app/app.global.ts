import { Injectable } from '@angular/core';

@Injectable()
export class AppSettings {
    // dev Link
     readonly siteURL = 'https://incytedev.sharepoint.com/sites/EHSMMS';
    // test Link
   // readonly siteURL = 'https://incytetest.sharepoint.com/sites/EHSMMS';

     // test Link
    // readonly siteURL = 'https://incyteuat.sharepoint.com/sites/EHSMMS';
    // Lists details
  
    readonly md_lkp_Buildings = 'md_lkp_Buildings';
    readonly select_Building = '?$select=Id,BuildingName,RegionId';
    readonly orderby_Building = '&$orderby=OrderNo';

    readonly md_lkp_Floors = 'md_lkp_Floors';
    readonly select_Floors = '?$select=Id,FloorName,BuildingId';
    readonly orderby_Floors = '&$orderby=OrderNo';


    readonly md_lkp_Locations = 'md_lkp_Locations';
    readonly select_Location = '?$select=Id,LocationName,LocationTypeId,BuildingId,FloorId,RegionId&$top=250';
    readonly orderby_Location = '&$orderby=OrderNo';

    readonly md_lkp_Departments = 'md_lkp_Departments';
    readonly select_Departments = '?$select=Id,Department';
    readonly orderby_Departments = '';

    readonly md_Users = 'md_Users';
    readonly select_Users = '?$select=Id,Name,DepartmentId';
    readonly orderby_Users = '';

    readonly WorkflowTasks = 'Workflow Tasks';
    readonly select_WorkflowTasks = '?$select=ID,LocationId,Answer,Question,BuildingId,FloorId,Regulation,StartDate,PossibleFineAmount,InspectionType,DepartmentsId,AssignedToId,AssignedTo/Name,AssignedTo/Title,Location/LocationName,Building/BuildingName,Floor/FloorName,Departments/Department&$expand=AssignedTo,Location,Building,Floor,Departments';
    readonly orderby_WorkflowTasks = '';



    readonly gifLocation =  this.siteURL +  "/SiteAssets/ApplicationCode/Reports/Resolved/loading.gif"





}
