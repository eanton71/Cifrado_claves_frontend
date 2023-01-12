import { Injectable } from '@angular/core';
import {util,pki} from 'node-forge';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor() { }

  encryptData(data:string):string{

    const pkey = pki.publicKeyFromPem(environment.pubkey);
    const cipherData = pkey.encrypt(data);
    const dataB64 = util.encode64(cipherData);
    return dataB64;
  }
}
