import { Component, OnInit } from "@angular/core";
import { OAuthService } from "../_services/auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { PlacesService } from "../_services/places.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { ViewChild } from "@angular/core";
import { element } from "protractor";

@Component({
  selector: "app-my-places",
  templateUrl: "./my-places.component.html",
  styleUrls: ["./my-places.component.css"],
})
export class MyPlacesComponent implements OnInit {
  user: any;
  user_id: string;
  my_places: any;
  places_size: number;

  @ViewChild(MatPaginator, { static: true }) set paginator(
    value: MatPaginator
  ) {
    this.my_places.paginator = value;
  }

  displayedColumns = [
    "name",
    "address",
    "hours",
    "latitude",
    "longitude",
    "remove",
  ];
  constructor(
    public auth: OAuthService,
    public afAuth: AngularFireAuth,
    public placeService: PlacesService
  ) {
    this.my_places = [];
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
        this.user_id = user.uid;
        this.placeService.getMyPlaces(this.user_id).then((doc) => {
          this.my_places = new MatTableDataSource(doc);
          this.places_size = doc.length;
        });
        return this.user_id;
      }
    });
  }
  updateName(event: any, column: string, place: any) {
    this.placeService.updatePlaceDoc(event, column, place, this.user_id);
  }

  deletePlace(element) {
    this.placeService.deletePlace(element, this.user_id);
  }
  ngOnInit() {}
}
