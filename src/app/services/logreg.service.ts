import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LogregService {

  private currentUserSubject:BehaviorSubject<User>;


  private url_login = '';
  private url_register = '';
  private url_update_image = '';

  constructor(private httpClient:HttpClient,private router:Router) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')||'{}'));

   }

  login(login:FormGroup):Observable<boolean>{

    const loginData = new FormData();

    loginData.append('eou',login.get('eou')?.value);
    loginData.append('password',login.get('password')?.value);

    return this.httpClient.post<User>(this.url_login,loginData,{observe:'response'}).pipe(map(response=>{
      if(response.status === 200){

        this.setLocalStorageUser(response.body!);
        return true;
      }

      return false;

    }),catchError(this.handleError<any>('login')));

  }

  register(register:FormGroup):Observable<object>{

    const registerData = new FormData();

    registerData.append('name',register.get('name')?.value);
    registerData.append('username',register.get('username')?.value);
    registerData.append('user_image',register.get('user_image')?.value);
    registerData.append('email',register.get('email')?.value);
    registerData.append('password',register.get('password')?.value);

    return this.httpClient.post(this.url_register,registerData,{observe:'body'}).pipe(catchError(this.handleError<any>('register')));

  }

  updateUserImage(userid:string,imagefile:File):Observable<boolean>{

    const formData = new FormData();
    formData.append("user_id",userid);
    formData.append("picture",imagefile);

    return this.httpClient.put<User>(this.url_update_image, formData,{observe:'response'}).pipe(map(response=>{

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
