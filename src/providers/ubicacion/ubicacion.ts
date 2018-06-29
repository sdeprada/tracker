import { Injectable } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { UsuarioProvider } from '../usuario/usuario';
import { Subscription } from 'rxjs/Subscription';

/*
  Generated class for the UbicacionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UbicacionProvider {

  taxista: AngularFirestoreDocument<any>;
  private watchTaxista: Subscription;

  constructor(private geolocation: Geolocation, private afDB: AngularFirestore, private usuarioProv: UsuarioProvider) {
    console.log('Hello UbicacionProvider Provider');
    
  }

  getTaxista() {
    console.log('getTaxista()');
    
    this.taxista = this.afDB.doc(`/usuarios/${this.usuarioProv.clave}`);
  }

  initGeolocalizacion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      console.log('initGeolocalizacion: ', resp);
      this.taxista.update({
        lat: resp.coords.latitude,
        lng: resp.coords.longitude,
        clave: this.usuarioProv.clave
      });
      this.watchTaxista = this.geolocation.watchPosition().subscribe((data) => {
         // data can be a set of coordinates, or an error (if an error occurred).
         // data.coords.latitude
         // data.coords.longitude
         console.log(data.coords);
         this.taxista.update({
          lat: data.coords.latitude,
          lng: data.coords.longitude,
          clave: this.usuarioProv.clave
        });
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  unsuscribeTaxista() {
    this.watchTaxista.unsubscribe();
  }

}
