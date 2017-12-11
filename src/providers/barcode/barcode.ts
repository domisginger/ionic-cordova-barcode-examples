//ionic cordova plugin add phonegap-plugin-barcodescanner
//npm install --save @ionic-native/barcode-scanner
//ionic cordova plugin add https://github.com/domisginger/cordova-plugin-lineabarcode
//ionic cordova plugin add https://github.com/domisginger/dff-cordova-plugin-honeywell
//ionic cordova plugin add cordova-plugin-nativestorage
//npm install --save @ionic-native/native-storage

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions, BarcodeScanResult } from '@ionic-native/barcode-scanner';
import { NativeStorage } from '@ionic-native/native-storage';
import { Subject } from 'rxjs/Subject';
import { LineaBarcodeScanner } from './../../plugin-interfaces/linea-barcode-scanner';
import { HoneywellBarcodeScanner } from './../../plugin-interfaces/honeywell-barcode-scanner';
import { LoggingServiceMock } from './../../mocks/logging.mock';
import { ToastServiceMock } from './../../mocks/toast.mock';

@Injectable()
export class BarcodeProvider {  
  lineaConnected: boolean;
  honeywellConnected: boolean;
  barcodeSubject: Subject<BarcodeScanResult>;

  private scanBeepOn: boolean;
  private scanBeepKey = 'scannerBeep';
  private scanningEnabled: boolean;
  private cameraOptions: BarcodeScannerOptions = {
    preferFrontCamera: false,
    showFlipCameraButton: false,
    showTorchButton: true,
    disableAnimations: false,
    disableSuccessBeep: !this.scanBeepOn,
    prompt: 'Place the barcode inside the scan area', //Android only
    formats: '', //Default all but PDF_417 and RSS_EXPANDED
    orientation: 'portrait', //Default unset so it rotates with the device
    resultDisplayDuration: 0, //ms Android only
    torchOn: false    
  };  

  constructor(
    public platform: Platform,    
    public barcodeScanner: BarcodeScanner,
    public lineaBarcodeScanner: LineaBarcodeScanner,
    public honeywellBarcodeScanner: HoneywellBarcodeScanner,
    public nativeStorage: NativeStorage,
    public loggingService: LoggingServiceMock,
    public toastService: ToastServiceMock
  ) { 
    this.platform.ready().then(() => {
      this.init();
    });    
  }
  
  scan(forceCamera?: boolean) {
    this.loggingService.log('scan');
    if(forceCamera) {
      this.scanCamera();
    } else {
      if(this.lineaConnected) {
        this.scanLinea();
      } else if(this.honeywellConnected) {
        this.scanCamera(); //No way in plugin to manually trigger scanning have to use the physical button
      } else {
        this.scanCamera();
      }  
    }    
  }

  scanCamera() {
    this.loggingService.log('scanCamera');
    if(this.scanningEnabled) this.barcodeScanner.scan(this.cameraOptions).then(data => { 
      this.cameraBarcodeScanned(data); 
    }, error => { 
      this.cameraError(error); 
    });
  }

  scanLinea() {    
    this.loggingService.log('scanLinea');
    if(this.scanningEnabled) this.lineaBarcodeScanner.barcodeStart();
  }  

  disableScanning() {
    this.loggingService.log('disableScanning');
    this.scanningEnabled = false;

    if(this.lineaConnected) {
      this.disableLineaScanning();
    } else if(this.honeywellConnected) {
      this.disableHoneywellScanning();
    } 
  }

  enableScanning() {
    this.loggingService.log('enableScanning');
    this.scanningEnabled = true;

    if(this.lineaConnected) {
      this.enableLineaScanning();
    } else if(this.honeywellConnected) {
      this.enableHoneywellScanning();
    }
  }
  
  //TODO: Currently Broken
  setScanBeep(setBeep: boolean): void {
    this.loggingService.log('setScanBeep');
    this.nativeStorage.setItem(this.scanBeepKey, setBeep);
    this.scanBeepOn = setBeep;
    this.scanBeepOn ? this.lineaBarcodeScanner.barcodeSetScanBeepOn() : this.lineaBarcodeScanner.barcodeSetScanBeepOff();    
  }

  private init() {
    this.scanningEnabled = true;
    this.barcodeSubject = new Subject()

    //Get/Set scanBeepOn from storage
    this.nativeStorage.getItem(this.scanBeepKey).then(data => {
      if (data === null) {
          this.nativeStorage.setItem(this.scanBeepKey, true);
          this.scanBeepOn = true;
      } else {
          this.scanBeepOn = data;
      }
      
      if(this.platform.is('ios')) {
        this.initLinea();
      } else if(this.platform.is('android')) {
        this.initHoneywell();
      } 
    }, () => {
        this.nativeStorage.setItem(this.scanBeepKey, true);
        this.scanBeepOn = true;

        if(this.platform.is('ios')) {
          this.initLinea();
        } else if(this.platform.is('android')) {
          this.initHoneywell();
        } 
    });   
  }

  private initLinea() {
    this.loggingService.log('initLinea');
    this.lineaBarcodeScanner.initLinea(
      connectionCallback => this.lineaConnectionChange,
      cardCallback => { }, //Don't need magnetic card reader
      barcodeCallback => this.lineaBarcodeScanned,
      success => { },
      this.lineaError
    );
  }

  private initHoneywell() {            
    this.loggingService.log('initHoneywell');
    try {
      this.honeywellBarcodeScanner.onBarcodeEvent(data => {      
        this.honeywellBarcodeScanned(data); 
      }, error => {
        this.honeywellError(error); 
      });
  
      this.honeywellBarcodeScanner.onFailureEvent(data => {
        //Scan pressed but nothing scanned
        this.loggingService.log('honeywell onFailure (Proberly scan pressed but nothing scanned)');
      }, error => {
        this.honeywellError(error); 
      });

      this.honeywellConnectedCallback();
    } catch(e) {
      this.honeywellDisconnectedCallback();
      this.honeywellError(e);
    }    
  }

  private lineaConnectionChange(state) {    
    this.loggingService.log('lineaConnectionChange');
    let connected = state == 2;
    
    if (connected) this.toastService.toastInfo('Linea Barcode Device Connected');
    
    this.lineaConnected = connected;
    this.connectionChange(connected);
  }
  
  private honeywellConnectedCallback() {
    this.loggingService.log('honeywellConnectedCallback');
    this.honeywellConnected = true;

    this.toastService.toastInfo('Honeywell Barcode Device Connected');
  }
  
  private honeywellDisconnectedCallback() {
    this.loggingService.log('honeywellDisconnectedCallback');
    this.honeywellConnected = false;
  }

  private connectionChange(connected: boolean) {    
    //Left for any events to raise on any barcode device connection change
    this.loggingService.log('Connection Changed: Connected: ' + connected);
  }

  private cameraBarcodeScanned(data: BarcodeScanResult) {
    this.loggingService.log('cameraBarcodeScanned');
    this.barcodeScanned(data);
  }

  private lineaBarcodeScanned(data: BarcodeScanResult) {
    this.loggingService.log('lineaBarcodeScanned');
    this.barcodeScanned(data);
  }

  private honeywellBarcodeScanned(event) {
    this.loggingService.log('honeywellBarcodeScanned', event); //Kept to check for other event.codes in future

    let format: 'QR_CODE' | 'DATA_MATRIX' | 'UPC_E' | 'UPC_A' | 'EAN_8' | 'EAN_13' | 'CODE_128' | 'CODE_39' | 'CODE_93' | 'CODABAR' | 'ITF' | 'RSS14' | 'RSS_EXPANDED' | 'PDF417' | 'AZTEC' | 'MSI';
    switch(event.codeId) {
      case 'w':
        format = 'DATA_MATRIX';
        break;

      case 'j':
      case 'i':
        format = 'CODE_128';
        break;

      case 'b':
        format = 'CODE_39';
        break;

      case '': //Unknown (Honeywell cant read)
        format = 'PDF417';
        break;

      default: 
        format = 'CODE_128'; //Defauly and hopefully get lucky with unknown barcodes
        break;
    };

    let data: BarcodeScanResult = {
      cancelled: !event,
      format: format,
      text: event.barcodeData
    };

    this.barcodeScanned(data);    
  }

  private barcodeScanned(data: BarcodeScanResult) {    
    this.loggingService.log('Barcode Scanned', data);
    if(!data.cancelled) this.barcodeSubject.next(data);
  }

  private disableLineaScanning() {
    this.loggingService.log('disableLineaScanning');
    this.lineaBarcodeScanner.barcodeButtonDisable();
  }
  
  private disableHoneywellScanning() {
    this.loggingService.log('disableHoneywellScanning');    
    this.honeywellBarcodeScanner.onBarcodeEvent(() => { }, () => { });
    this.honeywellBarcodeScanner.onFailureEvent(() => { }, () => { });
  }

  private enableLineaScanning() {
    this.loggingService.log('enableLineaScanning');
    this.lineaBarcodeScanner.barcodeButtonEnable();
  }

  private enableHoneywellScanning() {
    this.loggingService.log('enableHoneywellScanning');
    this.initHoneywell(); 
  }

  private cameraError(err) {
    this.error(err);
  } 

  private lineaError(err) {
    this.error(err);
  } 

  private honeywellError(err) {
    this.error(err);
  }  

  private error(err) {    
    this.loggingService.logError('BarcodeProvider Error', err);    
  }
}
