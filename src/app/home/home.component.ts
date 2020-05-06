import { Component, OnInit } from "@angular/core";
import { OAuthService } from "../_services/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { GoogleMapsAPIWrapper } from "@agm/core";

import { PlacesService } from "../_services/places.service";
import { AngularFireAuth } from "@angular/fire/auth";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  lat: number;
  lng: number;
  user: any;
  places: any;
  selectedPlace: any = [];
  placeSearched: boolean;
  stateCtrl = new FormControl();

  constructor(
    public auth: OAuthService,
    private router: Router,
    private placesService: PlacesService,
    public afAuth: AngularFireAuth
  ) {
    this.placesService.getPlaces().then((places) => {
      this.places = places;
    });
    this.lat = 20.5937;
    this.lng = 78.9629;
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  ngOnInit() {}
  getSelectedValue(value) {
    this.selectedPlace = [];

    for (let place of this.places) {
      if (value.option.value === place.name) {
        this.selectedPlace = place;
      }
    }
    this.placeSearched = true;
    // this.name = value.name;
  }
  addMyPlaces() {
    this.placesService.addMyPlaces(this.user.uid, this.selectedPlace);
  }
}
