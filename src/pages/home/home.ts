import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { UbicacionProvider } from '../../providers/ubicacion/ubicacion';
import { Geolocation } from '@ionic-native/geolocation';
import { Subscription } from 'rxjs/Subscription';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { LoginPage } from '../login/login';
/* import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation'; */

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

  constructor(public navCtrl: NavController, private ubicacionProv: UbicacionProvider, 
              private usuarioProv: UsuarioProvider,
              /* private backgroundGeolocation: BackgroundGeolocation, */
              private platform: Platform ) {
    
    this.ubicacionProv.getTaxista();
    this.subsTaxista = this.ubicacionProv.taxista.valueChanges().subscribe( data => {
      console.log('valueChanges de taxista en firebase: ', data);
      if ( data.lat && data.lng ) {
        this.user = data;
        this.initMap();
        console.log('nombre: ', this.user.nombre);
      }
      /* this.initBackgroudGeo(); */
      
    });
    this.ubicacionProv.initGeolocalizacion();
    
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
       
      this.marker.addListener('click', () => {
        // código por si quiero añadir un marcador. No se por qué no funciona
        let infowindow: google.maps.InfoWindow = new google.maps.InfoWindow({
          content: this.user.nombre
        });
        console.log('Abro el infowindow con contenido: ', infowindow.getContent());
        try {
          infowindow.open(this.map, this.marker);
        } catch (error) {
          console.error(error);
          
        }
        
      });
    } else {
      // Si el mapa ya existe, lo único que hago es actualizar la posición del marcador
      console.log('El mapa ya existe, actualizo la posición del marcador');
      this.marker.setPosition( this.user );
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

    this.user = null;
    this.map = null;
    this.marker = null;

    // If you wish to turn OFF background-tracking, call the #stop method.
    /* this.backgroundGeolocation.stop(); */

  }

 /*  initBackgroudGeo() {
    console.log('------------initBackgroundGeo---------------');
    if ( this.platform.is('cordova') ) {
    
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: true, // enable this to clear background location settings when the app terminates
      };
    
      this.backgroundGeolocation.configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
    
        console.log('---------- Cambio de localización:', location);
      
        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      
      });
    
      // start recording location
      this.backgroundGeolocation.start();
    } else {
      console.log('No estamos en dispositivo');
      
    }
    
  } */

}

interface Taxista {
  nombre: string;
  clave: string;
  lat: number;
  lng: number;
}
