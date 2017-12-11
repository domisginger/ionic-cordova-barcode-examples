import { IGS1 } from "./barcode-gs1";
import { IGTIN13 } from "./barcode-gtin13";
import { INote } from "./barcode-note";
import { IPatientIdentificationSheet } from "./barcode-patient-identification-sheet";

export class ClinicalBarcodeResult {
    constructor(
        public text: string,
        public format: string,        
        public isValidGS1?: boolean,          
        public isValidGTIN13?: boolean,
        public isValidSpecimen?: boolean,
        public isValidHospitalNumber?: boolean,
        public isValidCaseNoteNumber?: boolean,
        public isValidPatientRecord?: boolean,
        public isValidPatientIdentificationSheet?: boolean,
        public isValidGRAI?: boolean,
        public gs1?: IGS1,
        public grai?: any,
        public gtin13?: IGTIN13,
        public caseNoteNumber?: string,
        public patientRecord?: INote,
        public patientIdentificationSheet?: IPatientIdentificationSheet
    ) { }
}