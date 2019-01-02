export class Building {
    Id: string;
    BuildingName: string;    
    RegionId: string;
}

export class Floor {
    Id: string;
    FloorName: string;
    BuildingId: String;
}

export class Locations {
    Id: string;
    LocationName: string;
    LocationTypeId: string;
    BuildingId: string;
    FloorId: string;
    RegionId: string; 
}

export class Departments {
    Id: string;
    Department: string;    
}

export class Persons {
    Id: string;
    Name: string;  
    DepartmentId :string;
    //AssignedToId:string; 
}

export class Reports {
    Id: string;
    AssignedTo: string;  
    AssignedToId:string;
    LocationId :string; 
    Location :string;   
    BuildingId :string;
    Building :string;
    FloorId :string;
    Floor :string;
    DepartmentsId:string;
    Departments:string;
    Regulation: string;
    PossibleFineAmount: string;
    Question: string;
    Answer : string;
    InspectionType:string;
    StartDate:string;
}