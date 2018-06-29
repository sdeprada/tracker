import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides, AlertController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { HomePage } from '../home/home';
import { AdminPage } from '../admin/admin';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  //para hacer una referencia a un elemento del html:
  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private usuarioProv: UsuarioProvider,
            ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    // Para cambiar los bullets por una barra de progreso:
    this.slides.paginationType = 'progress';
    // Para que el usuario no pueda pasar de página:
    this.slides.lockSwipes(true);
    this.slides.freeMode = false;
  }

  mostrarInput() {
    let alert = this.alertCtrl.create({
      title: 'Registre su usuario:',
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Entrar',
          handler: data => {
            console.log('Valor del prompt', data);
            if ( data.username === 'Admin') {
              console.log('Es el admin');
              this.navCtrl.setRoot(AdminPage);
            } else {
              this.verificarUsuario( data.username );
            }
            
          }
        }
      ]
    });
    alert.present();
  }

  verificarUsuario( clave: string ) {
    let loading = this.loadingCtrl.create({
      content: 'Verificando'
    });
    loading.present();

    this.usuarioProv.verificarUsuario( clave ).then ( existe => {
      console.log('Retorno del provider: ', existe);
      loading.dismiss();
      if ( existe ) {
        this.slides.lockSwipes(false);
        this.slides.freeMode = true;
        this.slides.slideNext();
        this.slides.lockSwipes(true);
        this.slides.freeMode = false;
      } else {
        let alert = this.alertCtrl.create({
          title: 'Usuario no existente:',
          subTitle: 'Consulte con el administrador o pruebe de nuevo',
          buttons: ['OK']
        });
        alert.present();
      }
      
    });


  }

  ingresar() {
    this.navCtrl.setRoot( HomePage );
  }

}
