import { Component, OnInit } from "@angular/core";
import { OAuthService } from "../_services/auth.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";

import { PlacesService } from "../_services/places.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from "angularx-social-login";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl(""),
    password: new FormControl(""),
  });
  stateCtrl = new FormControl();
  places: any = [];
  placeSearched: boolean;
  name: string;
  address: string;
  location: string;
  opening_hours: string;
  mapType: string = "satellite";
  lat: number;
  lng: number;

  map: any;
  user: any;
  zoom = 8;
  bounds: boolean;
  profileFlag: boolean;
  selectedPlace: any = [];
  constructor(
    public auth: OAuthService,
    private router: Router,
    private placesService: PlacesService,
    public afAuth: AngularFireAuth,
    private authService: AuthService
  ) {
    this.lat = 20.5937;
    this.lng = 78.9629;
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.placesService.getPlaces().then((places) => {
          this.places = places;
        });
      }
    });
  }

  updateProfile() {
    this.profileFlag = true;
  }

  mapReady(event: any) {
    this.map = event;
  }

  getSelectedValue(value) {
    this.selectedPlace = [];

    for (let place of this.places) {
      if (value.option.value === place.name) {
        this.selectedPlace = place;
      }
    }
    this.placeSearched = true;
    this.name = value.name;
  }

  ngOnInit() {}
  addMyPlaces() {
    this.placesService.addMyPlaces(this.user.uid, this.selectedPlace);
  }
  submit(form) {
    this.auth.loginWithEmail(form);
    // this.router.navigate(["/home"]);
  }
  googleSignin() {
    this.auth.googleSignin();
  }
  signInWithFB(): void {
    this.auth.fbLogin();
  }

  logout() {
    this.auth.signOut();
    this.router.navigateByUrl("/login");
    window.location.reload();
  }
}
