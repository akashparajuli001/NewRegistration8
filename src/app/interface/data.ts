import { Unit, ConsumerEntity } from "./serialdetail.interface";
import { SerialTale } from "./serialtable";

export interface Data {
    SerialNumber?: string;
    Model?: string;
    ListSerialTable?: SerialTale[];
    InstalledDate?: Date;
    InstallType?: string;
    

    Address1?: string;
    Address2?:string;
    City?: string;
    Zip?: string;
    Country?: string;
    FirstName?: string;
    LastName?: string;
    CompanyName?: string;
    


    MailingAddress1?:string;
    MailingAddress2?:string;
    MailingZip?:string;
    MailingCity?:string;
    MailingState?:string;
    MailingCountry?:string;


    DealerName?:string;
    DealerPhone?:string;
  }