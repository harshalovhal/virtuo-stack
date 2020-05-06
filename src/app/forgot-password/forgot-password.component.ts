import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { FormGroup, FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  model: any = {};
  email: string;
  returnUrl: string;
  form: FormGroup = new FormGroup({
    email: new FormControl(""),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar
  ) {}
  ngOnInit() {}

  async sendPasswordResetEmail() {
    this.snackBar.open("Password link is send to your email", "", {
      duration: 4000,
      verticalPosition: "top",
      panelClass: ["red-snackbar"],
    });
    return await this.afAuth.sendPasswordResetEmail(this.form.value.email);
  }
}
