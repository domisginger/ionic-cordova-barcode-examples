export class Note implements INote {
    constructor(
        public caseNoteId: string,          
        public forename: string,
        public surname: string
    ) { }
}

export interface INote  {
    caseNoteId: string;
    forename: string;
    surname: string;
} 