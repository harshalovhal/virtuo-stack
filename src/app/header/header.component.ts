import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { OAuthService } from "../_services/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Subscriber } from "rxjs";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  user: any;
  isLoggedIn: boolean;
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    public auth: OAuthService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl("/login");
  }

  ngOnDestroy() {
    this.user.unsubscribe();
  }
}
