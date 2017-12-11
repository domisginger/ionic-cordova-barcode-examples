import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { BarcodeProvider } from './../barcode/barcode';
import { LoggingServiceMock } from './../../mocks/logging.mock';
import { ClinicalBarcodeResult } from './../../models/clinical-barcode-result';
import { IBarcodeCollection, BarcodeCollection } from './../../models/barcode-collection';
import { Note } from './../../models/barcode-note';

@Injectable()
export class ClinicalBarcodeProvider {
  barcodeSubject: Subject<IBarcodeCollection>;

  constructor(
    public platform: Platform,
    public barcodeProvider: BarcodeProvider,
    public loggingService: LoggingServiceMock
  ) {
    this.platform.ready().then(() => {                
      this.barcodeSubject = new Subject();
      
      this.barcodeProvider.barcodeSubject.subscribe(result => {
        this.barcodeScanned(result);
      }, error => {
        this.loggingService.logError('Barcode Subject Error', error);
      });
    });
  }

  private barcodeScanned(result: BarcodeScanResult) {
    if(!result.cancelled) {
      let asciiResult = result.text.replace(/[^ -~]+/gi, ',');
      let format = result.format.replace(/_/g, ' ');
      
      let clinicalResult = new ClinicalBarcodeResult(asciiResult, format);
      clinicalResult.isValidGS1 = this.isValidGS1(asciiResult);
      clinicalResult.isValidGTIN13 = this.isValidGTIN13(asciiResult);
      clinicalResult.isValidSpecimen = this.isValidSpecimen(asciiResult);
      clinicalResult.isValidHospitalNumber = this.isValidHospitalNumber(asciiResult);
      clinicalResult.isValidCaseNoteNumber = this.isValidCaseNoteNumber(asciiResult, format.toUpperCase());
      clinicalResult.isValidPatientRecord = this.isValidPatientRecord(asciiResult);
      clinicalResult.isValidPatientIdentificationSheet = this.isValidPatientIdentificationSheet(asciiResult);
      clinicalResult.isValidGRAI = this.isValidGRAI(asciiResult);

      switch (format.toUpperCase()) {
        case 'DATA MATRIX':
          if (clinicalResult.isValidGS1) {
            clinicalResult.gs1 = {
              nhsNumber: this.dataMatrixToNHSNumber(asciiResult),
              hospitalNumber: this.dataMatrixToHospitalNumber(asciiResult),
              name: this.dataMatrixToName(asciiResult),
              dob: this.dataMatrixToDoB(asciiResult),
              tob: this.dataMatrixToToB(asciiResult),
              babyNumber: this.dataMatrixToBabyNumber(asciiResult),
              parentName: this.dataMatrixToParentName(asciiResult)
            };
          } else if (clinicalResult.isValidGRAI) {
            clinicalResult.grai = this.dataMatrixToGRAI(asciiResult);
          }
          break;

        case 'CODE 128':
        case 'GS1 128':
        case 'UCC 128':			
        case 'EAN 128':
        case 'UCC/EAN 128':
        case 'CODE 39':
          if (clinicalResult.isValidHospitalNumber) { //Keeping compatability with older vesions of barcode.js
            clinicalResult.gs1 = {
              hospitalNumber: this.code128ToHospitalNumber(asciiResult)
            };
          } else if (clinicalResult.isValidGTIN13) {
            clinicalResult.gtin13 = this.getGTIN13(asciiResult);
          } else if (clinicalResult.isValidCaseNoteNumber) {
            clinicalResult.caseNoteNumber = this.getCaseNoteNumber(asciiResult, format.toUpperCase());
          }
          break;

        case 'QR CODE':
          if (clinicalResult.isValidPatientRecord) {
            clinicalResult.patientRecord = this.getPatientRecord(asciiResult);
          } 
          break;

        case 'PDF417':
        case 'PDF 417':
          if (clinicalResult.isValidPatientIdentificationSheet) {
            clinicalResult.patientIdentificationSheet = this.getPatientIdentificationSheet(asciiResult);
          }
          break;
      }

      this.processBarcode(clinicalResult);
    }    
  }

  private processBarcode(data: ClinicalBarcodeResult) {
    if (data.isValidGS1 || data.isValidHospitalNumber) {                
      this.barcodeSubject.next(new BarcodeCollection(data.gs1, null, null, null, null, null));                
    } else if (data.isValidGTIN13) {                                
      this.barcodeSubject.next(new BarcodeCollection(null, data.gtin13, null, null, null, null));                
    } else if (data.isValidSpecimen) {                
      this.barcodeSubject.next(new BarcodeCollection(null, null, data.text, null, null, null));
    } else if (data.isValidCaseNoteNumber) {                                
      let note = new Note(data.caseNoteNumber, null, null);                
      this.barcodeSubject.next(new BarcodeCollection(null, null, null, note, null, null));
    } else if (data.isValidPatientRecord) {        
      this.barcodeSubject.next(new BarcodeCollection(null, null, null, data.patientRecord, null, null));
    } else if (data.isValidPatientIdentificationSheet) {                
      this.barcodeSubject.next(new BarcodeCollection(null, null, null, null, data.patientIdentificationSheet, null));
    } else {                                
      this.barcodeSubject.next(new BarcodeCollection(null, null, null, null, null, data.text));                
    }
  }

  private isValidGS1(input: string) {
    let startIndex = input.indexOf('8018');
    return (startIndex >= 0) ? this.isValidGS118(input.substring(startIndex + 4, startIndex + 22)) : false;
  }

  private isValidGS118(input) {
    if (input.length < 18) return false;

    let gs1 = input.trim().slice(-18);
    let sum = 0;
    let j = 1;
    for (let i = 0; i <= 16; i++) {
      let temp = parseInt(gs1[i]);
      let multiplyBy = j % 2 == 0 ? 1 : 3;
      j++;
      sum = sum + (temp * multiplyBy);
    }

    let rounded = Math.ceil(sum / 10) * 10;
    let checksum = rounded - sum;
    return gs1[17] == checksum;
  }

  private isValidGTIN13(input) {
    if (input.length < 13) return false;

    let gtin13 = input.trim().slice(-13);
    let sum = 0;
    let j = 1;
    for (let i = 0; i <= 11; i++) {
      let temp = parseInt(gtin13[i]);
      let multiplyBy = j % 2 == 0 ? 3 : 1;
      j++;
      sum = sum + (temp * multiplyBy);
    }

    let rounded = Math.ceil(sum / 10) * 10;
    let checksum = rounded - sum;
    return gtin13[12] == checksum;
  }

  private isValidSpecimen(input) {    
    return /^\w{2}\d{6}$/ig.test(input);
  }

  private isValidHospitalNumber(input) {
    input = input.replace('W-', '');
    return /^\w?\d{6,9}$/ig.test(input);
  }

  private isValidCaseNoteNumber(input, barcodeType?) {
    let result = (barcodeType && barcodeType === 'CODE 39')
      ? this.correctCode39EncodingErrors(input).split("/")
      : input.replace(/\W/g, "/").split("/");

    switch (result.length) {
      case 1:
        return this.isValidHospitalNumber(result[0]);
      case 3:
        if (!/^\w{2,3}$/ig.test(result[0])) return false; //Type Prefix ie HN|TFO
        if (!this.isValidHospitalNumber(result[1])) return false; //Hospital Number
        if (!/^\d{2}$/ig.test(result[2])) return false; //Volume

        return true;
    }

    return false;
  }

  private correctCode39EncodingErrors(input) {
    let replaceChars = [
      {
        replace: /\!/,
        value: "/A"
      },
      {
        replace: /\"/,
        value: "/B"
      },
      {
        replace: /\#/,
        value: "/C"
      },
      {
        replace: /\$/,
        value: "/D"
      },
      {
        replace: /\%/,
        value: "/E"
      },
      {
        replace: /\&/,
        value: "/F"
      },
      {
        replace: /\'/,
        value: "/G"
      },
      {
        replace: /\(/,
        value: "/H"
      },
      {
        replace: /\!/,
        value: "/A"
      },
      {
        replace: /\)/,
        value: "/I"
      },
      {
        replace: /\*/,
        value: "/J"
      },
      {
        replace: /\+/,
        value: "/K"
      },
      {
        replace: /\,/,
        value: "/L"
      },
      {
        replace: /\:/,
        value: "/Z"
      }
    ];

    let result = input;
    for (let i = 0; i < replaceChars.length; i++) {
      result = result.replace(replaceChars[i].replace, replaceChars[i].value);
    }

    return result.replace(/\W/g, "/");
  }

  private isValidPatientRecord(input) {
    let result = input.split(" ;");
    if (result.length === 3) {
      return (this.isValidCaseNoteNumber(result[0])) ? true : false;
    }
    return false;
  }

  private isValidPatientIdentificationSheet(input) {
    let result = input.split(",");

    if (result.length !== 5) return false;
    if (!this.isValidHospitalNumber(result[0])) return false;

    return true;
  }

  private isValidGRAI(input) {
    let  startIndex = input.indexOf('80030');
    return (startIndex >= 0) ? this.isValidGTIN13(input.substring(startIndex + 5, startIndex + 18)) : false;
  }

  private dataMatrixToNHSNumber(input) {
    let startIndex = input.indexOf('8018');
    return input.substring(startIndex + 11, startIndex + 21);
  }

  private dataMatrixToHospitalNumber(input) {
    let split = input.split(',');
    let orgCodeIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '91')
        orgCodeIndex = i;      
    }

    if (orgCodeIndex !== null)
      return split[orgCodeIndex + 1];

    return null;
  }

  private dataMatrixToName(input) {
    let split = input.split(',');
    let nameIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '93')
        nameIndex = i;      
    }

    if (nameIndex !== null)
      return split[nameIndex].substring(2) + ', ' + split[nameIndex + 1];    

    return null;
  }

  private dataMatrixToDoB(input) {
    let split = input.split(',');
    let nameIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '93') 
        nameIndex = i;      
    }

    if (nameIndex !== null)
      return split[nameIndex + 2];
    
    return null;
  }

  private dataMatrixToToB(input) {
    let split = input.split(',');
    let babyIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '92')
        babyIndex = i;        
    }

    if (babyIndex !== null) 
      return split[babyIndex - 1];    

    return null;
  }

  private dataMatrixToBabyNumber(input) {
    let split = input.split(',');
    let babyIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '92')
        babyIndex = i;      
    }

    if (babyIndex !== null)
      return split[babyIndex].substring(2);    

    return null;
  }

  private dataMatrixToParentName(input) {
    let split = input.split(',');
    let babyIndex = null;
    for (let i = 0; i < split.length; i++) {
      if (split[i].substring(0, 2) == '92')
        babyIndex = i;      
    }

    if (babyIndex !== null)
      return split[babyIndex + 1] + ', ' + split[babyIndex + 2];    

    return null;
  }

  private dataMatrixToGRAI(input) {
    let startIndex = input.indexOf('80030');
    let identifier = input.substring(startIndex + 5, startIndex + 18);
    let value = input.substring(startIndex + 18, input.length);

    return {
      identifier: identifier,
      value: value
    };
  }

  private code128ToHospitalNumber(input) {
    return input.replace('W-', '');
  }

  private getGTIN13(input) {
    let gtin13 = input.trim().slice(-13);
    let extension = input.trim().substr(0, input.length - 13)

    return {
      gtin13: gtin13,
      extension: extension
    };
  }

  private getCaseNoteNumber(input, barcodeType) {
    return (barcodeType && barcodeType === 'CODE 39') ? this.correctCode39EncodingErrors(input) : input.replace(/\W/g, "/");
  }

  private getPatientRecord(input) {
    let result = input.split(" ;");
    
    return {
        caseNoteId: result[0],
        forename: result[1],
        surname: result[2]
    };
  }

  private getPatientIdentificationSheet(input) {
    let result = input.split(",");

    return {
      hospitalNumber: result[0],
      documentType: result[1],
      appointmentDate: result[2],
      specialty: result[3],
      printedDate: result[4]
    };
  }
}
