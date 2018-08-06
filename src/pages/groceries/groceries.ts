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
	}

	ionViewWillEnter() {
		this.groceries = databaseProvider.getGroceries();

	}

	updateGrocery(grocery) {
		// update database
		grocery.completed = !grocery.completed;
		this.databaseProvider.updateGrocery(grocery, grocery.completed);
	}

	openAddGroceryPage() {
		const modal = this.modalCtrl.create(AddGroceryPage);
		modal.present();
	}
}
