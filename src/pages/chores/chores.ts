import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AddChorePage } from '../add-chore/add-chore';

@Component({
	selector: 'page-chores',
	templateUrl: 'chores.html'
})
export class ChoresPage {

	constructor(public navCtrl: NavController) {

	}

	openAddChorePage() {
		this.navCtrl.push(AddChorePage);
	}

}
