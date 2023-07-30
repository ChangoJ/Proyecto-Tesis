import { Component } from '@angular/core';
import { DetalleService } from './components/services/detalle.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DetalleService]
})
export class AppComponent {
  public title = 'sistema-web-creacion-de-horarios-unibe';

  constructor() {
 
  }




}
