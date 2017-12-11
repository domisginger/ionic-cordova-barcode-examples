export class GRAI implements IGRAI {
    constructor(
        public identifier: string,          
        public value: string,
        public surname: string
    ) { }
}

export interface IGRAI  {
    identifier: string;
    value: string;
} 