import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from "firebase";
import { switchMap } from "rxjs/operators";
import { User } from "../_models/user.model"; // optional
import { Observable, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class PlacesService {
  user$: Observable<User>;
  current_user_id: string;
  placesArray: any = [];
  my_places: any = [];
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public snackBar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          this.current_user_id = user.uid;
          console.log(user.uid);
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }

  async getPlaces() {
    this.placesArray = [];
    let placesDoc = await firebase.firestore().collection("places").get();
    placesDoc.forEach((results) => {
      let places = results.data();
      this.placesArray.push(places);
    });
    return this.placesArray;
  }

  async addMyPlaces(user, places) {
    let user_id = user;
    let userDocRef = await firebase
      .firestore()
      .collection("users")
      .doc(user_id);
    // .get()
    userDocRef.get().then((doc) => {
      if (doc.exists) {
        userDocRef
          .collection("my_places")
          .get()
          .then((sub) => {
            if (sub.docs.length > 0) {
              let status = userDocRef
                .collection("my_places")
                .where("name", "==", places.name)
                .get();
              status.then((doc) => {
                if (doc.docs.length > 0) {
                  this.snackBar.open("Place already exists!", "", {
                    duration: 4000,
                    verticalPosition: "top",
                    panelClass: ["red-snackbar"],
                  });
                } else {
                  userDocRef.collection("my_places").doc().set(places);
                  this.snackBar.open("New place added", "", {
                    duration: 4000,
                    verticalPosition: "top",
                    panelClass: ["red-snackbar"],
                  });
                }
              });
            } else {
              userDocRef.collection("my_places").doc().set(places);
              this.snackBar.open("New place added", "", {
                duration: 4000,
                verticalPosition: "top",
                panelClass: ["red-snackbar"],
              });
            }
          });
      }
    });
  }

  async updatePlaceDoc(
    event: any,
    column: string,
    place: any,
    user_id: string
  ) {
    let placeObj = {};
    placeObj[column] = event;
    let myPlaceDocRef = await firebase
      .firestore()
      .collection("users")
      .doc(user_id)
      .collection("my_places")
      .where("name", "==", place.name)
      .get();
    myPlaceDocRef.forEach((doc) => {
      let data = doc.data();
      let docRef = doc.ref;
      docRef.update(placeObj);
    });
  }

  async deletePlace(place, user_id) {
    let myPlaceDocRef = await firebase
      .firestore()
      .collection("users")
      .doc(user_id)
      .collection("my_places")
      .where("name", "==", place.name)
      .get();
    myPlaceDocRef.forEach((doc) => {
      let data = doc.data();
      let docRef = doc.ref;
      docRef.delete();
      this.snackBar.open("Deleted the place", "", {
        duration: 4000,
        verticalPosition: "top",
        panelClass: ["red-snackbar"],
      });
    });
  }

  async getMyPlaces(user_id) {
    this.my_places = [];
    let myPlacesDocRef = await firebase
      .firestore()
      .collection("users")
      .doc(user_id)
      .collection("my_places")
      .get();
    myPlacesDocRef.forEach((docs) => {
      this.my_places.push(docs.data());
    });
    return this.my_places;
  }
}
