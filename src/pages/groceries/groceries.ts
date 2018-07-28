import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AddGroceryPage } from '../add-grocery/add-grocery';

@Component({
	selector: 'page-groceries',
	templateUrl: 'groceries.html'
})
export class GroceriesPage {

	constructor(
		public navCtrl: NavController,
		public modalCtrl: ModalController) {

	}

	openAddGroceryPage() {
		const modal = this.modalCtrl.create(AddGroceryPage);
		modal.present();
	}
}
