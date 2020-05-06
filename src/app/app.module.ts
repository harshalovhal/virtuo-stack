import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { MatCheckboxModule, MatPaginatorModule } from "@angular/material";
import {
  SocialLoginModule,
  AuthServiceConfig,
  FacebookLoginProvider,
} from "angularx-social-login";
import {
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatAutocomplete,
} from "@angular/material";
import { MatFormFieldModule, MatRippleModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertService } from "./_services/alert.service";
import { OAuthService } from "./_services/auth.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import {
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatAutocompleteModule,
} from "@angular/material";
import {
  MatSnackBarModule,
  MatTableModule,
  MatInputModule,
} from "@angular/material";
import { AgmCoreModule } from "@agm/core";

import { HeaderComponent } from "./header/header.component";
import { EmailSignupComponent } from "./email-signup/email-signup.component";
import { MyPlacesComponent } from "./my-places/my-places.component";
import { HomeComponent } from "./home/home.component";

const config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider("1940649139402717"),
  },
]);

export function provideConfig() {
  return config;
}

const firebaseConfig = {
  apiKey: "AIzaSyA6TZ8DdGfWappKE28Eo6MAxjqLuniupTM",
  authDomain: "fir-app-88475.firebaseapp.com",
  databaseURL: "https://fir-app-88475.firebaseio.com",
  projectId: "fir-app-88475",
  storageBucket: "fir-app-88475.appspot.com",
  messagingSenderId: "350574289985",
  appId: "1:350574289985:web:33cf0e528c0152e14292c0",
  measurementId: "G-LZLVGRLHHJ",
};
@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
    LoginComponent,
    HeaderComponent,
    EmailSignupComponent,
    MyPlacesComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.config),
    // AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    SocialLoginModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatInputModule,
    MatPaginatorModule,

    AgmCoreModule.forRoot({
      // apiKey: "AIzaSyDf-Srx_Lcs4kyHYeOm73SKx-8N4yYmUEc",
      apiKey: "AIzaSyCtnJi2wlmV7xSKGaG1AhtHMX0JS1J1mCA",
    }),
  ],

  providers: [
    AuthGuard,
    AlertService,
    // AuthService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig,
    },
  ],
  // entryComponents: [LoginComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
