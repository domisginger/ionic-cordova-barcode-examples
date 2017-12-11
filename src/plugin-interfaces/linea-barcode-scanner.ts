import { Injectable } from '@angular/core';
import { IonicNativePlugin } from '@ionic-native/core';
declare let LineaBarcode: any;

@Injectable()
export class LineaBarcodeScanner extends IonicNativePlugin {   
    initLinea (connectionCallback?: Function, cardCallback?: Function, barcCallback?: Function, successCallback?: Function, errorCallback?: Function): void { 
        return LineaBarcode.initLinea(
            connectionCallback,
            cardCallback,
            barcCallback,
            successCallback,
            errorCallback      
        );
    }

    barcodeSetChargeDeviceOn(): Promise<any> { 
        return LineaBarcode.barcodeSetChargeDeviceOn();
    }

    barcodeSetChargeDeviceOff(): Promise<any> { 
        return LineaBarcode.barcodeSetChargeDeviceOff();    
    }

    barcodeSetPassThroughSyncOn(): Promise<any> { 
        return LineaBarcode.barcodeSetPassThroughSyncOn();    
    }

    barcodeSetPassThroughSyncOff(): Promise<any> { 
        return LineaBarcode.barcodeSetPassThroughSyncOff();    
    }

    barcodeSetScanBeepOff(): Promise<any> { 
        return LineaBarcode.barcodeSetScanBeepOff();    
    }

    barcodeSetScanBeepOn(): Promise<any> { 
        return LineaBarcode.barcodeSetScanBeepOn();    
    }

    barcodeButtonEnable(): void { 
        return LineaBarcode.barcodeButtonEnable();    
    }

    barcodeButtonDisable(): void { 
        return LineaBarcode.barcodeButtonDisable();    
    }

    barcodeStart(): void { 
        return LineaBarcode.barcodeStart();    
    }

    barcodeStop(): void { 
        return LineaBarcode.barcodeStop();    
    }
}