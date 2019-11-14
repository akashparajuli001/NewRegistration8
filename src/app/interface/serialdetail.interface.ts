import { Moment } from "moment";

export interface Unit {
    serialnumber?: string;
    item?: string;
    modeldesc?: string;
    Manufacturer?: string;
    ManufactureDate?: Date;
    warning?: string;
    HasUnitExchangeCoverage: boolean;
  }

  export interface ConsumerEntity {
    Address1?: string;
    City?: string;
    Zip?: string;
    Country?: string;
    Source?: string;
    FirstName?: string;
    LastName?: string;
    CompanyName?: string;
    PhoneNumber?: string;
    Address2?: string;
    AddrType?: string;
    Email?: string;
    state?: string;
    UsrNum?: string;
    UsrSeq?: string;
    receive_emails?: Number;
    MailingAddress?: MailingAddress;
  }

  export interface MailingAddress {
    FirstName?: string;
    LastName?: string;
    StreetAddress1?: string;
    StreetAddress2?: string;
    City?: string;
    State?: string;
    ZipCode?: string;
    Country?: string;

  }

  export interface Dealer {
    Name?: string;
    Phone?: string;
    Email?: string;
    Address1?: string;
    Address2?: string;
    City?: string;
    State?: string;
    ZipCode?: string;
    Country?: string;

  }

  export interface RegistrationUnit {
     Item?: string;
     SerNum?: string;
     Modeldesc?: string;
     InstallType?: string;
     InstallDate?: string;
     Installer?: string;
     ComponentType?: Number;
     Type?: string;
     InstallerPhone?: string;
     ManufactureNum?: string;
     ManufactureName?: string;
     agree_to_maintenance?: Number;
     InstalledByDealer?: Number;
     TerminationDate?: Date;
     RegistrationDate?: Date;


  }
  export interface Entitlement {
    SerNum?: string;
    Model?:string;
    Modeldesc?: string;
    RegistrationDate?: string;
    InstallDate?: Date;
    ManufactureDate?: string;
    StandardCoverage?: string;
    RegisteredCoverage?:string;
    lines: EntitlementLines[];

 }
 export interface EntitlementLines {
  Coverage_Type?: string;
  Description?:string;
  CoverageStartDate?: Date;
  CoverageEndDate?: Date;
  Entitlement_Code?:string;
  StartDate?:string;
  EndDate?:string;
  
}

 export interface responseUnit {
  SerNum: string;
  Model:string;
  LastName: string;
  InstallType: string; 
}