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

	ionViewDidLoad() {
		this.groceries = this.databaseProvider.getGroceries();

	}

	/**
	 * Updates this grocery's completed value
	 */
	updateGrocery(grocery) {
		// update database
		grocery.completed = !grocery.completed;
		this.groceries = [];
		this.databaseProvider.updateGrocery(grocery, grocery.completed).then(() => {
			this.groceries = this.databaseProvider.getGroceries();
		})
	}

	openAddGroceryPage() {
		const modal = this.modalCtrl.create(AddGroceryPage);
		modal.present();
	}
}
