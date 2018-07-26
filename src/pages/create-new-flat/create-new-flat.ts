import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { JoinExistingFlatPage } from '../join-existing-flat/join-existing-flat';
import { FirestoreProvider } from '../../providers/firestore/firestore';

@Component({
	selector: 'page-create-new-flat',
	templateUrl: 'create-new-flat.html'
})
export class CreateNewFlatPage {
	public createNewFlatForm: FormGroup;
	constructor(
		public navCtrl: NavController,
		public formBuilder: FormBuilder,
		public databaseProvider: FirestoreProvider
	) {
		this.createNewFlatForm = formBuilder.group({
			flatName: ['', Validators.required]
		});
	}

	createNewFlat() {
		if(!this.createNewFlatForm.valid) {
			console.log(this.createNewFlatForm.value);
		} else {
			this.databaseProvider.createNewFlat(this.createNewFlatForm.value.flatName);
		}
	}

	goToJoinExistingFlatPage() {
		this.navCtrl.setRoot(JoinExistingFlatPage);
	}
}
