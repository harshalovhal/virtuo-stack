import { Component, OnInit } from "@angular/core";
import { OAuthService } from "../_services/auth.service";
import { FacebookLoginProvider, SocialUser } from "angularx-social-login";
import { FormGroup, FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  user: any;
  user_id: string;
  user_info: any = {};
  constructor(
    public auth: OAuthService,
    private router: Router,
    public afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.user_id = user.uid;
        this.auth.getUserData(this.user_id).then((user_data) => {
          this.user_info = user_data;
        });
      }
    });
  }

  ngOnInit() {}
}
