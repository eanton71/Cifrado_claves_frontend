import { Component } from '@angular/core';
import {FormGroup,FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { LogregService } from '../services/logreg.service';

@Component({
  selector: 'app-log-register',
  templateUrl: './log-register.component.html',
  styleUrls: ['./log-register.component.scss']
})
export class LogRegisterComponent {

  registerForm:FormGroup;
  loginForm:FormGroup;

  constructor(private fb:FormBuilder, private logreg:LogregService, private route:Router){
    this.registerForm = this.fb.group({
      name:['',Validators.required],
      username:['',Validators.required],
      user_image:['no_image.png',Validators.required],
      email:['',Validators.required],
      password:['',Validators.required],
      passrepeat:['',Validators.required]
    })

    this.loginForm = this.fb.group({
      eou:['',Validators.required],
      password:['',Validators.required]
    })
  }

  sendLogin():void{

    if(this.loginForm.invalid){
      return;
    }

    this.logreg.login(this.loginForm).subscribe(result=>{
      console.log(result);
      if(result){
        console.log('logged');
        this.route.navigateByUrl('/profile');
      }
    })



  }

  sendRegister():void{

    if(this.registerForm.invalid){
      return;
    }

    this.logreg.register(this.registerForm).subscribe(result=>{

      if(result){
       window.location.reload();
      }
    })

  }

}