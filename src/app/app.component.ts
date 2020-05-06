import { Component, OnInit } from "@angular/core";
import { OAuthService } from "../app/_services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AuthService,
  FacebookLoginProvider,
  SocialUser,
} from "angularx-social-login";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import * as firebase from "firebase";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  // user: any;
  user_id: string;
  signinForm: FormGroup;
  user: SocialUser;
  loggedIn: boolean;
  provider = new firebase.auth.FacebookAuthProvider();

  constructor(
    public auth: OAuthService,
    private router: Router,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // this.afAuth.authState.subscribe((user) => {
    //   if (user) {
    //     this.user = user;
    //     this.user_id = user.uid;
    //   }
    // });
  }

  loginFlag: boolean = false;
  profileFlag: boolean = false;
  title = "virtuo-stack-assignment";
  onActivate(event) {
    document.body.scrollTop = 0;
  }
  logout() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
    window.location.reload();
  }
  ngOnInit() {
    this.signinForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      console.log(this.user);
    });
  }

  signInWithFB(): void {
    // this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    firebase.auth().signInWithRedirect(this.provider);
  }
  signOut(): void {
    this.authService.signOut();
  }
}
