export class GTIN13 implements IGTIN13 {
    constructor(
        public gtin13: string,          
        public extension: string
    ) { }
}

export interface IGTIN13  {
    gtin13: string;
    extension: string;
} 