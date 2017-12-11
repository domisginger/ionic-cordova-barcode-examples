import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeProvider } from './../../providers/barcode/barcode';

@IonicPage({
  name: 'home'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public barcodeService: BarcodeProvider
  ) { }  

  scan() {
    this.barcodeService.scan();
  }

  scanCamera() {
    this.barcodeService.scanCamera();
  }

  scanLinea() {
    this.barcodeService.scanLinea();
  }  

  disableScanning() {
    this.barcodeService.disableScanning();
  }

  enableScanning() {
    this.barcodeService.enableScanning();
  }

  enableBeep() {
    this.barcodeService.setScanBeep(true);
  }

  disableBeep() {
    this.barcodeService.setScanBeep(false);
  }
}