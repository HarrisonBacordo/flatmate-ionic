import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Loading } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { FormGroup, Validators,  FormBuilder } from '../../../node_modules/@angular/forms';
import { LoginPage } from '../login/login';

@Component({
	selector: 'page-forgot-password',
	templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
	public loading: Loading;
	public resetPasswordForm: FormGroup;
	constructor(
		public navCtrl: NavController,
		public loadingCtrl: LoadingController,
		public authProvider: AuthProvider,
		public alertCtrl: AlertController,
		public formBuilder: FormBuilder) {
			this.resetPasswordForm = formBuilder.group({
				email: ['',
					Validators.compose([Validators.required, EmailValidator.isValid])],
			});
	}

	sendResetPassword() {
		if(!this.resetPasswordForm.valid) {
			console.log(this.resetPasswordForm.value);
		} else {
			this.authProvider.resetPassword(this.resetPasswordForm.value.email)
				.then(resetData => {
					this.loading.dismiss().then(() => {
						this.navCtrl.setRoot(LoginPage);
					})
				}, error => {
					this.loading.dismiss().then(() => {
						let alert = this.alertCtrl.create({
							message: error.message,
							buttons: [
								{
									text: "Ok",
									role: 'cancel'
								}
							]
						});
						alert.present();
					});
				});
				this.loading = this.loadingCtrl.create();
				this.loading.present();
		}
	}

}
