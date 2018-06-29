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

  map: any;
  user: any;
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
    let mapEle: HTMLElement = document.getElementById('map');
    console.log('mapEle:', mapEle);
    console.log('taxista', this.user);
    
    //let uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    this.map = new google.maps.Map(
      mapEle, {zoom: 12, center: this.user});
    // The marker, positioned at Uluru
    let marker = new google.maps.Marker({position: this.user, map: this.map,
      title: 'Tu posición'});

      var infowindow = new google.maps.InfoWindow({
        content: 'Sergio'
      });
    
     
      marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });
  }

  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log('loadMap', latitude, longitude);
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
    console.log(mapEle);
    
  
    // create LatLng object
    let myLatLng = {lat: latitude, lng: longitude};
  
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Hello World!'
      });
      //mapEle.classList.add('show-map');
    }); 
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
