import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LogRegisterComponent } from './log-register/log-register.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:'',component:LogRegisterComponent,pathMatch:'full'},
  {path:'profile',component:ProfileComponent,pathMatch:'full',canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
