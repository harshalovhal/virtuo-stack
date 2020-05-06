import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { OAuthService } from "../_services/auth.service";
@Component({
  selector: "app-email-signup",
  templateUrl: "./email-signup.component.html",
  styleUrls: ["./email-signup.component.css"],
})
export class EmailSignupComponent implements OnInit {
  formData: FormGroup = new FormGroup({
    username: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
  });

  constructor(private auth: OAuthService) {}

  ngOnInit() {}
  submit() {
    this.auth.signUpWithEmail(this.formData);
  }
}
