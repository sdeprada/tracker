import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  map: google.maps.Map;
  marker: google.maps.Marker;
  user: Taxista;
  private subsTaxista: Subscription;

  constructor(public navCtrl: NavController, private ubicacionProv: UbicacionProvider, private geolocation: Geolocation, private usuarioProv: UsuarioProvider ) {
    this.ubicacionProv.initGeolocalizacion();
    this.ubicacionProv.getTaxista();
    this.subsTaxista = this.ubicacionProv.taxista.valueChanges().subscribe( data => {
      console.log('valueChanges de taxista: ', data);
      
      this.user = data;
      this.initMap();
      console.log('nombre: ', this.user.nombre);
      
      
    });
    
  }

 ionViewDidLoad(){
    //this.getPosition();
    //this.initMap();
  }
  

  initMap() {
    console.log('initMap: está creado el mapa y el marcador?', this.map, this.marker);
    
    if ( !this.map || !this.marker ) {
      let mapEle: HTMLElement = document.getElementById('map');
      console.log('taxista: ', this.user);
      
      this.map = new google.maps.Map(
        mapEle, {zoom: 14, center: this.user});
  
      this.marker = new google.maps.Marker({position: this.user, map: this.map,
        title: this.user.nombre});
      
      // código por si quiero añadir un marcador
      let infowindow = new google.maps.InfoWindow({
        content: '<ion-badge item-end>'+ this.user.nombre+'</ion-badge>'
      });
      
       
      this.marker.addListener('click', function() {
        infowindow.open(this.map, this.marker);
      });
    } else {
      // Si el mapa ya existe, lo único que hago es actualizar la posición del marcador
      console.log('El mapa ya existe, actualizo la posición del marcador');
      this.marker.setPosition(this.user);
      this.map.setCenter( this.user );
    }

    

    
    
  }

  salir() {
    //dejamos de ver los cambios del taxista
    try {
      this.subsTaxista.unsubscribe();
      this.ubicacionProv.unsuscribeTaxista();
    } catch (e )  {
      console.error('Error al hacer el unsubscribe', JSON.stringify(e));
      
    }
    //eliminamos los datos del usuario:
    this.usuarioProv.logout();

    this.navCtrl.setRoot(LoginPage);

  }

}

interface Taxista {
  nombre: string;
  clave: string;
  lat: number;
  lng: number;
}
