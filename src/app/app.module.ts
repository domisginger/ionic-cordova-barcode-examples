import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler, Platform } from 'ionic-angular';
import { App } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NativeStorage } from '@ionic-native/native-storage';
import { LineaBarcodeScanner } from './../plugin-interfaces/linea-barcode-scanner';
import { HoneywellBarcodeScanner } from './../plugin-interfaces/honeywell-barcode-scanner';
import { PluginFactories } from './../plugin-interfaces/plugin-factories';
import { BarcodeProvider } from './../providers/barcode/barcode';
import { ClinicalBarcodeProvider } from '../providers/clinical-barcode/clinical-barcode';
import { BarcodeScannedProvider } from './../providers/barcode-scanned/barcode-scanned';
import { LoggingServiceMock } from './../mocks/logging.mock';
import { ToastServiceMock } from './../mocks/toast.mock';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(App)
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    App
  ],
  providers: [
    StatusBar,
    SplashScreen,    
    NativeStorage,
    {
      provide: ErrorHandler, 
      useClass: IonicErrorHandler
    },    
    {
      provide: BarcodeScanner, 
      useFactory: PluginFactories.barcodeScannerFactory,
      deps: [Platform, AlertController]
    },
    {
      provide: LineaBarcodeScanner, 
      useFactory: PluginFactories.lineaBarcodeScannerFactory,
      deps: [Platform]
    },
    {
      provide: HoneywellBarcodeScanner, 
      useFactory: PluginFactories.honeywellBarcodeScannerFactory,
      deps: [Platform]
    },
    LoggingServiceMock,
    ToastServiceMock,
    BarcodeProvider,
    ClinicalBarcodeProvider,
    BarcodeScannedProvider
  ]
})

export class AppModule { }
