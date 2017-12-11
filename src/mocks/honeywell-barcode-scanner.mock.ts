import { HoneywellBarcodeScanner } from './../plugin-interfaces/honeywell-barcode-scanner';

export class HoneywellBarcodeScannerMock extends HoneywellBarcodeScanner {    
    onLog(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    onBarcodeEvent(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    onFailureEvent(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeReaderPressSoftwareTrigger(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}
