import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-user',
  templateUrl: './side-user.component.html',
  styleUrls: ['./side-user.component.css']
})

export class SideUserComponent implements OnInit {

  user: any;
  visibleAlertas: boolean = false;
  userSubcripcion: Subscription = new Subscription();

  constructor(
    //private auth: AuthService,
    //private usersService: UsersService,
  ) {
   }

  ngOnInit() {}

  logoff() {
    // this.auth.logoff();
    // this.usersService.cancelSubsctiptions();
  }
}
