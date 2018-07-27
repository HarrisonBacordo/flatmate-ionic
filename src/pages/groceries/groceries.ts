import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddGroceryPage } from '../add-grocery/add-grocery';

@Component({
	selector: 'page-groceries',
	templateUrl: 'groceries.html'
})
export class GroceriesPage {

	constructor(public navCtrl: NavController) {

	}

	openAddGroceryPage() {
		this.navCtrl.push(AddGroceryPage);
	}
}
