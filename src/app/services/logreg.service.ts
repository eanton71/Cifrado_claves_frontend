import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class LogregService {

  private currentUserSubject:BehaviorSubject<User>;


  constructor(private httpClient:HttpClient,private router:Router, private crypto:CryptoService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')||'{}'));

   }

  login(login:FormGroup):Observable<boolean>{

    const loginData = new FormData();

    loginData.append('eou',this.crypto.encryptData(login.get('eou')?.value));
    loginData.append('password',this.crypto.encryptData(login.get('password')?.value));

    return this.httpClient.post<User>(environment.url_login,loginData,{observe:'response'}).pipe(map(response=>{
      if(response.status === 200){

        this.setLocalStorageUser(response.body!);
        return true;
      }

      return false;

    }),catchError(this.handleError<any>('login')));

  }

  register(register:FormGroup):Observable<object>{

    const registerData = new FormData();

    registerData.append('name',this.crypto.encryptData(register.get('name')?.value));
    registerData.append('username',this.crypto.encryptData(register.get('username')?.value));
    registerData.append('user_image',this.crypto.encryptData(register.get('user_image')?.value));
    registerData.append('email',this.crypto.encryptData(register.get('email')?.value));
    registerData.append('password',this.crypto.encryptData(register.get('password')?.value));

    return this.httpClient.post(environment.url_register,registerData,{observe:'body'}).pipe(catchError(this.handleError<any>('register')));

  }

  updateUserImage(userid:string,imagefile:File):Observable<boolean>{

    const formData = new FormData();
    formData.append("user_id",userid);
    formData.append("picture",imagefile);

    return this.httpClient.put<User>(environment.url_update_image, formData,{observe:'response'}).pipe(map(response=>{

      if(response.ok){

          console.log(response.body);

          this.updateImageLocalStorage(response.body!);

          return true;

      }
      return false;

    }),catchError(this.handleError<any>('updateUserImage')));

  }

  public get currentUserValue(): User | undefined{
    const user = JSON.parse(localStorage.getItem('user')!);
    this.currentUserSubject.next(user);
    if(this.currentUserSubject !== null){
      return this.currentUserSubject.value;
    }
    return undefined;
  }

  public get userName():string{

    return this.currentUserSubject.value.name;

  }

  public get userEmail():string{

    return this.currentUserSubject.value.email;

  }

  public get userId():string{

    return this.currentUserSubject.value._id;

  }

  public get userPicture():string{

    return this.currentUserSubject.value.user_image;

  }

  logout():void{
    localStorage.removeItem('user');
    this.currentUserSubject.next({_id:'',
      name:'',
      username:'',
      user_image:'',
      email:''})
    this.router.navigate(['']);
  }

  private updateImageLocalStorage(user:User):void{

    let usr = JSON.parse(localStorage.getItem('user')!);
    user.user_image = usr.user_image;
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  setLocalStorageUser(user:User):void{
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSubject.next(user);
  }


  private handleError<T>(operation = 'opearation',result?:T){
    return (error:any):Observable<T>=>{
      // TODO: send the error to remote logging infrastructure
      console.error(error);// log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    }
  }
}
