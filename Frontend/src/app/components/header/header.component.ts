import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  especificacion(){
    this._router.navigate(['/especificacion/asignaturas'])
  }

  constructor(
    private _router: Router){

    }
}
