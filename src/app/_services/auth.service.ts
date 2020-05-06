import { Injectable } from "@angular/core";
import { User } from "../_models/user.model"; // optional
import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import * as firebase from "firebase";

import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AlertService } from "./alert.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class OAuthService {
  user$: Observable<User>;
  public loggedInUser: any = {};
  current_user_id: string;
  user_info: any = {};
  fb_user_info: any = {};
  provider = new firebase.auth.FacebookAuthProvider();

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertService: AlertService,
    public snackBar: MatSnackBar
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        // Logged in
        if (user) {
          this.current_user_id = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    );
  }
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user);
  }

  fbLogin() {
    // this.provider.setCustomParameters({
    //   display: "popup",
    // });
    firebase
      .auth()
      .signInWithPopup(this.provider)
      .then(function (result) {
        let userP = auth().currentUser;
        if (result.additionalUserInfo.isNewUser === true) {
          firebase.firestore().collection("users").doc(userP.uid).set({
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            uid: result.user.uid,
          });
        }
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.signInWithPopup(provider).then(
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  loginWithEmail(formData) {
    if (formData.valid) {
      var email = formData.value.email;
      var password = formData.value.password;

      auth()
        .signInWithEmailAndPassword(email, password)
        .then((success) => {
          this.router.navigateByUrl("/home");
        })
        .catch((err) => {
          if (err.code == "auth/user-not-found") {
            this.alertService.error(
              "We don't have an account with this email address. Perhaps you entered it incorrectly?"
            );
            this.snackBar.open(err.message, "", {
              duration: 4000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          } else if (err.code == "auth/wrong-password") {
            this.alertService.error("The password you entered is incorrect");
            this.snackBar.open(err.message, "", {
              duration: 4000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          } else if (err.code == "auth/invalid-email") {
            this.alertService.error(
              "The email address you've entered has an invalid format"
            );
            this.snackBar.open(err.message, "", {
              duration: 4000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          } else {
            this.alertService.error(err.message);
          }
          this.snackBar.open(err.message, "", {
            duration: 4000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
        });
    }
  }
  loginWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    provider.addScope("email");
    this.afAuth.signInWithRedirect(provider);
    this.afAuth.signInWithPopup(provider).then(
      (success) => {},
      (error) => {
        switch (error.code) {
          case "auth/user-cancelled":
            this.alertService.error("Your login was cancelled.", true);
            break;
          case "auth/account-exists-with-different-credential":
            this.alertService.error(
              `An account with the email ID "${error.email}" already exists.`,
              true
            );
            break;
          default:
            this.alertService.error(error.message, true);
            break;
        }
        this.snackBar.open(error.message, "", {
          duration: 4000,
          verticalPosition: "top",
          panelClass: ["red-snackbar"],
        });
        console.error(error);
      }
    );
  }

  signUpWithEmail(formData) {
    if (formData.valid) {
      var email = formData.value.email;
      var password = formData.value.password;
      var name = formData.valid.usern;

      auth()
        .createUserWithEmailAndPassword(email, password)
        .then((newUser) => {
          let user = auth().currentUser;
          const userRef: AngularFirestoreDocument<User> = this.afs.doc(
            `users/${user.uid}`
          );

          user
            .updateProfile({ displayName: formData.value.name })
            .then((success) => {
              auth().currentUser.reload();
              this.loggedInUser.name = user.displayName;
              localStorage.setItem(
                "userState",
                JSON.stringify({
                  id: user.uid,
                  name: formData.value.username,
                  email: formData.value.email,
                })
              );
            });

          const data = {
            uid: user.uid,
            email: formData.value.email,
            displayName: formData.value.username,
            photoURL: user.photoURL,
          };
          this.router.navigate(["/login"]);
          this.snackBar.open("Account Created", "", {
            duration: 4000,
            verticalPosition: "top",
            panelClass: ["red-snackbar"],
          });
          return userRef.set(data, { merge: true });
        })
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            this.alertService.error(
              `An account with the email ID "${formData.value.email}" already exists.`
            );
            this.snackBar.open(err.message, "", {
              duration: 4000,
              verticalPosition: "top",
              panelClass: ["red-snackbar"],
            });
          } else {
            this.alertService.error(err.message);
          }
        });
    }
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  async getUserData(user_id) {
    let userSnapShot = await firebase
      .firestore()
      .collection("users")
      .doc(user_id)
      .get()
      .then((user) => {
        this.user_info = user.data();
      });
    return this.user_info;
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(["/"]);
  }
}
