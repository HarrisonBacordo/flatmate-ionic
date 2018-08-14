import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'flat-id',
	templateUrl: 'flat-id.html'
})
export class FlatIdPage {
	qrData = null;
	createdCode = null;
	scannedCode = null;
	nullCode = 'Unassigned';

	constructor(
		private barcodeScanner: BarcodeScanner,
		public navCtrl: NavController,
		public databaseProvider: FirestoreProvider) { }

	ionViewDidLoad() {
		this.qrData = this.databaseProvider.flatId;
		this.createdCode = this.qrData;
  }

	createCode() {
		this.createdCode = this.qrData;
	}

	scanCode() {
		this.barcodeScanner.scan().then(barcodeData => {
			this.scannedCode = barcodeData.text;
		}, (err) => {
			console.log('Error: ', err);
		});
	}

}