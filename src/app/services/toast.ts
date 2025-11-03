import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  async present(message: string, type: 'success' | 'danger' | 'warning' = 'danger') {
    const iconMap = {
      success: '✅',
      danger: '❌',
      warning: '⚠️'
    };

    const toast = await this.toastCtrl.create({
      message: `${iconMap[type]} ${message}`,
      duration: 2500,
      position: 'top',
      color: type,
      cssClass: 'custom-toast'
    });

    await toast.present();
  }
}