import { IGS1 } from './barcode-gs1';
import { IGTIN13 } from './barcode-gtin13';
import { INote } from './barcode-note';
import { IPatientIdentificationSheet } from './barcode-patient-identification-sheet';

export class BarcodeCollection implements IBarcodeCollection {
    constructor(        
        public patient?: IGS1,
        public location?: IGTIN13,
        public specimen?: string,
        public note?: INote,
        public patientIdentificationSheet?: IPatientIdentificationSheet,
        public other?: string
    ) { }
}

export interface IBarcodeCollection  {
    patient?: IGS1;
    location?: IGTIN13;
    specimen?: string;
    note?: INote;
    patientIdentificationSheet?: IPatientIdentificationSheet;
    other?: string;
} 