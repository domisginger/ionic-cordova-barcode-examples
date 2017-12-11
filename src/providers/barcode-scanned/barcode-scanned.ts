import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, AlertController } from 'ionic-angular';
import { ClinicalBarcodeProvider } from './../clinical-barcode/clinical-barcode';

@Injectable()
export class BarcodeScannedProvider {
  constructor(
    public platform: Platform,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public clinicalBarcodeProvider: ClinicalBarcodeProvider
  ) {
    console.log('Hello BarcodeScannedProvider Provider');
    this.platform.ready().then(() => {                                    
      this.clinicalBarcodeProvider.barcodeSubject.subscribe(result => {        
        let alert = this.alertCtrl.create({
          title: 'Barcode Scanned',
          subTitle: JSON.stringify(result),
          buttons: ['Ok']
        });
        alert.present();  
      }, error => {
        console.error(error);
      });
    });
  }
}
