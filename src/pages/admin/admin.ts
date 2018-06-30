import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
import { Subscription } from 'rxjs/Subscription';
import { } from '@types/googlemaps';



/**
 * Generated class for the AdminPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//declare var google;

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  taxistaSel: string;
  taxistas: Taxista[] = [];
  taxistasSubs: Subscription;
  map: google.maps.Map;

  constructor(public navCtrl: NavController, private usuarioProv: UsuarioProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdminPage');
    this.taxistasSubs = this.usuarioProv.getTaxistas().subscribe( data => {
      console.log('Llamada a getTaxistas: ', data);
      this.taxistas = data;   
      
      if ( this.taxistas && this.taxistas.length > 0 ) {
        console.log('Nº de taxistas: ', this.taxistas.length);
        
        // create a new map by passing HTMLElement
        let mapEle: HTMLElement = document.getElementById('map');
        //console.log(mapEle);
        
        //centramos el mapa con las coordenadas del primer taxista por defecto
        let myLatLng = {lat: this.taxistas[0].lat, lng: this.taxistas[0].lng};
  
        // create map
        this.map = new google.maps.Map(mapEle, {
          center: myLatLng,
          zoom: 5
        });
      
        

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          this.taxistas.forEach(taxista => {
            console.log('Creamos un marcador para: ', taxista.nombre);
            let myLatLng = {lat: taxista.lat, lng: taxista.lng};
            let marker = new google.maps.Marker({
              position: myLatLng,
              map: this.map,
              title: taxista.nombre
            });
          });
        }); 
      }

    });
    
    
  }

  salirAdmin() {
    this.taxistasSubs.unsubscribe();
    this.navCtrl.setRoot(LoginPage);
  }

  //loadMap( taxista: { nombre: string, lat: number, lng: number, clave: string} ){
loadMap() {
    let taxista;
    this.taxistas.forEach( taxi => {
      if( taxi.clave === this.taxistaSel ) {
        taxista = taxi;
      }
    });
    console.log('taxista para cargar mapa: ', taxista);
     
    let myLatLng = {lat: taxista.lat, lng: taxista.lng};

    this.map.setCenter( myLatLng );
    this.map.setZoom(12);
  
    
  }

}

interface Taxista {
  nombre: string;
  clave: string;
  lat: number;
  lng: number;
}
//"app_id": "7c6b5e8e", ionic.config.json