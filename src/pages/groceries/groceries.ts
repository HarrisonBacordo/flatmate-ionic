import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddGroceryPage } from '../add-grocery/add-grocery';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-groceries',
	templateUrl: 'groceries.html'
})
export class GroceriesPage {
	public groceries: any;

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController,
		public databaseProvider: FirestoreProvider) {
			this.groceries = databaseProvider.getGroceries();
	}

	updateItem(item) {
		// update database
		
	}

	openAddGroceryPage() {
		const modal = this.modalCtrl.create(AddGroceryPage);
		modal.present();
	}
}
