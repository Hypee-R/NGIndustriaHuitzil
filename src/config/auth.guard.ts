import { Injectable } from '@angular/core';
import { Router, CanLoad } from '@angular/router';
import { ConfigService } from 'src/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: ConfigService,
    private router: Router
  ) {}

  canLoad(): boolean {
    if (this.authService.token && this.authService.expiredTimeValid()){
      //console.log("Autenticado");
      return true;
    }else {
      localStorage.clear();
      //console.log("No autenticado");
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }

}
