import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {
  clave: string;
  usuario: any = {};
  usuarioSubs: Subscription;
  taxistasSubs: Subscription;

  constructor(private afDB: AngularFirestore, private storage: Storage, private platform: Platform) {
    console.log('Hello UsuarioProvider Provider');
  }

  verificarUsuario( clave: string ) {
    return new Promise((resolve, reject) => {
      this.usuarioSubs = this.afDB.doc(`/usuarios/${clave}`).valueChanges().subscribe( data => {
        console.log('Data de firebase: ', data);
        
        if ( data ) {
          //el usuario sí existe:
          this.clave = clave;
          this.usuario = data;
          this.guardarStorage();
          resolve(true);
        } else {
          console.log('El usuario no existe');
          resolve(false);
        }

      });
    });
  }

  guardarStorage() {
    
    if ( this.platform.is('cordova')) {
      console.log('GuardarStorage en Dispositivo');
      this.storage.set('clave', this.clave);
    } else {
      console.log('guardarStorage en escritorio');
      localStorage.setItem('clave', this.clave);
    }
  }

  cargarStorage() {
    return new Promise((resolve, reject) => {
      if ( this.platform.is('cordova')) {
        console.log('cargarStorage en Dispositivo');
        this.storage.get('clave').then( data => {
          console.log('cargarStorage, data recogida: ', data);
          
          if ( data ) {
            this.clave = data;
            resolve(true);
          } else {
            resolve( false );
          }
        } );
      } else {
        console.log('cargarStorage en escritorio');
        let claveSt = localStorage.getItem('clave');
        console.log('cargarStorage, valor recogido: ', claveSt);
        
        if ( claveSt ) {
          this.clave = claveSt;
          resolve(true);
        } else {
          resolve( false);
        }
      }
    });
  }

  logout() {
    if ( this.platform.is('cordova') ) {
      this.storage.remove('clave');
    } else {
      localStorage.removeItem('clave');
    }
    this.clave = null;
    this.usuario = {};
    try {
      this.usuarioSubs.unsubscribe();
    } catch (error) {
      console.error('Error al unsubscribe usuario', JSON.stringify(error));
      
    }
  }

  getTaxistas(): Observable<any> {
    /* this.taxistasSubs = this.afDB.collection('/usuarios').valueChanges().subscribe( data => {
      console.log('getTaxistas', data);
    }); */
    return this.afDB.collection('/usuarios').valueChanges();
  }

  /* unsubscribeTaxistas() {
    this.taxistasSubs.unsubscribe();
  } */
}
