import { Injectable } from '@angular/core';
import { IonicNativePlugin } from '@ionic-native/core';
declare let Honeywell: any;

@Injectable()
export class HoneywellBarcodeScanner extends IonicNativePlugin {    
    onLog(success, error, args?): Promise<any> { 
        return Honeywell.onLog(success, error, args);
    }

    onBarcodeEvent(success, error, args?): Promise<any> { 
        return Honeywell.onBarcodeEvent(success, error, args);
    }

    onFailureEvent(success, error, args?): Promise<any> { 
        return Honeywell.onFailureEvent(success, error, args); 
    }

    barcodeReaderPressSoftwareTrigger(success, error, args?): Promise<any> { 
        return Honeywell.barcodeReaderPressSoftwareTrigger(success, error, args); 
     }    
}