export class PatientIdentificationSheet implements IPatientIdentificationSheet {
    constructor(
        public hospitalNumber: string,
        public documentType: string,
        public appointmentDate: string,
        public specialty: string,
        public printedDate: string
    ) { }
}

export interface IPatientIdentificationSheet  {
    hospitalNumber: string;
    documentType: string;
    appointmentDate: string;
    specialty: string;
    printedDate: string;
} 