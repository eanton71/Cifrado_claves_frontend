import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogregService {

  private url_login = 'http://localhost:3000/api/login-user';
  private url_register = 'http://localhost:3000/api/register-user';

  constructor(private httpClient:HttpClient) { }

  login(login:FormGroup):Observable<object>{

    const loginData = new FormData();

    loginData.append('eou',login.get('eou')?.value);
    loginData.append('password',login.get('password')?.value);

    return this.httpClient.post(this.url_login,loginData,{observe:'body'}).pipe(catchError(this.handleError<any>('login')));

  }

  register(register:FormGroup):Observable<object>{

    const registerData = new FormData();

    registerData.append('name',register.get('name')?.value);
    registerData.append('username',register.get('username')?.value);
    registerData.append('email',register.get('email')?.value);
    registerData.append('password',register.get('password')?.value);

    return this.httpClient.post(this.url_register,registerData,{observe:'body'}).pipe(catchError(this.handleError<any>('register')));

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
