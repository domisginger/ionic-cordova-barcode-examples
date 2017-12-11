export class GS1 implements IGS1 {
    constructor(
        public nhsNumber: string,          
        public hospitalNumber: string,
        public name: string,
        public dob: string,
        public tob: string,
        public babyNumber: string,
        public parentName: string
    ) { }
}

export interface IGS1  {
    nhsNumber?: string;
    hospitalNumber?: string;
    name?: string;
    dob?: string;
    tob?: string;
    babyNumber?: string;
    parentName?: string;
} 