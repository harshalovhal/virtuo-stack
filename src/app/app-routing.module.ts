import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { AuthGuard } from "./auth.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { HeaderComponent } from "./header/header.component";
import { EmailSignupComponent } from "./email-signup/email-signup.component";
import { MyPlacesComponent } from "./my-places/my-places.component";
import { HomeComponent } from "./home/home.component";
const routes: Routes = [
  {
    path: "profile",
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: EmailSignupComponent,
  },
  {
    path: "my-places",
    canActivate: [AuthGuard],
    component: MyPlacesComponent,
  },
  {
    path: "home",
    canActivate: [AuthGuard],
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
