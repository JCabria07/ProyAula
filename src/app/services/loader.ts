import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  async present(message: string = 'Bienvenido estimado usuario, será redirigido al Dashboard.') {
    this.loading = await this.loadingCtrl.create({
      spinner: 'crescent',
      message: message,
      cssClass: 'custom-loader',
      duration: 3000
    });
    await this.loading.present();
  }

  async dismiss() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}