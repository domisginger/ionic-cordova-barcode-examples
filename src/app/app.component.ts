import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeProvider } from './../providers/barcode/barcode';
import { ClinicalBarcodeProvider } from './../providers/clinical-barcode/clinical-barcode';
import { BarcodeScannedProvider } from './../providers/barcode-scanned/barcode-scanned';

@Component({
  templateUrl: 'app.html'
})

export class App {
  rootPage:any = 'home';

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public barcodeProvider: BarcodeProvider,
    public clinicalBarcodeProvider: ClinicalBarcodeProvider,
    public barcodeScannedProvider: BarcodeScannedProvider
  ) {
    platform.ready().then(() => {
      this.init();
    });
  }

  private init() {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}