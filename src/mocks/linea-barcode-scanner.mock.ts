import { LineaBarcodeScanner } from './../plugin-interfaces/linea-barcode-scanner';

export class LineaBarcodeScannerMock extends LineaBarcodeScanner {
    private connectionCallback: Function;
    private cardCallback: Function;
    private barcCallback: Function;
    private cancelCallback: Function;
    private errorCallback: Function;

    initLinea(connectionCallback?, cardCallback?, barcCallback?, cancelCallback?, errorCallback?): void {
        this.connectionCallback = connectionCallback;
        this.cardCallback = cardCallback;
        this.barcCallback = barcCallback;
        this.cancelCallback = cancelCallback;
        this.errorCallback = errorCallback;
        return;
    }

    barcodeSetChargeDeviceOn(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeSetChargeDeviceOff(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeSetPassThroughSyncOn(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeSetPassThroughSyncOff(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeSetScanBeepOff(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    barcodeSetScanBeepOn(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    barcodeButtonEnable(): void {
        return;
    }

    barcodeButtonDisable(): void {
        return;
    }

    barcodeStart(): void {
        this.onBarcodeData();
        return;
    }

    barcodeStop(): void {
        return;
    }

    connectionChanged(): any {
        return 2; //Connected
    }

    onMagneticCardData(): any {
        return 'track1' + 'track2' + 'track3'; //Connected
    }

    onBarcodeData(): any {
        if(this.barcCallback) this.barcCallback({
            format: 'CODE_128', 
            cancelled: false, 
            text: 'F636067' 
        });

        return;
    }
}
