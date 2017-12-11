import { Platform } from "ionic-angular/platform/platform";
import { AlertController } from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { LineaBarcodeScanner } from "./linea-barcode-scanner";
import { HoneywellBarcodeScanner } from "./honeywell-barcode-scanner";
import { BarcodeScannerMock } from "./../mocks/barcode-scanner.mock";
import { LineaBarcodeScannerMock } from "./../mocks/linea-barcode-scanner.mock";
import { HoneywellBarcodeScannerMock } from "./../mocks/honeywell-barcode-scanner.mock";

let isMobile = (platform: Platform): boolean => {
    return platform.is('ios') || platform.is('android');
}

export let PluginFactories = {
    barcodeScannerFactory: (platform: Platform, alertCtrl: AlertController) => { 
        return isMobile(platform) ? new BarcodeScanner() : new BarcodeScannerMock(alertCtrl);
    },
    lineaBarcodeScannerFactory:  (platform: Platform) => { 
        return isMobile(platform) ? new LineaBarcodeScanner() : new LineaBarcodeScannerMock();
    },
    honeywellBarcodeScannerFactory:  (platform: Platform) => { 
        return isMobile(platform) ? new HoneywellBarcodeScanner() : new HoneywellBarcodeScannerMock();
    }
}