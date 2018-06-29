import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UsuarioProvider } from '../providers/usuario/usuario';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private usuarioProv: UsuarioProvider) {
    platform.ready().then(() => {
      this.usuarioProv.cargarStorage().then( existe => {
        console.log('Constructor de Appcomponent: usuario ya logado?', existe);
        
        if (existe) {
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage
        }

        statusBar.styleDefault();
        splashScreen.hide();
      });
      
      
    });
  }
}

