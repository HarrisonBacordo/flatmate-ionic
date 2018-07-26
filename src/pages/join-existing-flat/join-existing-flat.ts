import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { TabsPage } from '../tabs/tabs';

@Component({
	selector: 'page-join-existing-flat',
	templateUrl: 'join-existing-flat.html'
})

export class JoinExistingFlatPage {
	public joinExistingFlatForm: FormGroup;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder
	) {
		this.joinExistingFlatForm = formBuilder.group({
			flatId: ['', Validators.required]
		});
	}

	goToChoresPage() {
		this.navCtrl.setRoot(TabsPage);
	}
}
