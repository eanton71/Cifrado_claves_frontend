import { Component } from '@angular/core';
import { LogregService } from '../services/logreg.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  username:string;
  email:string;
  image:string;
  path:string;

  constructor(private logreg:LogregService){
    this.username = '';
    this.email = '';
    this.image = '';
    this.path = '/assets/image/';
  }

  ngOnInit():void{

    this.username = this.logreg.userName !== null?this.logreg.userName:'';
    this.email = this.logreg.userEmail !== null?this.logreg.userEmail:'';
    this.image = this.logreg.userPicture !== null?this.logreg.userPicture:'';

    if(this.image === 'no_image.png'){
      this.path = this.path + this.image;
    }else{
      this.path = this.path+this.logreg.userId+'/'+this.image;
    }
  }

  fileSelected(e:Event):void{
    const file:File = (e.target as HTMLInputElement).files![0];

    const allowed = ['image/png','image/jpg','image/jpeg'];

    if(file !== undefined && allowed.includes(file.type)){

      this.logreg.updateUserImage(this.logreg.userId,file).subscribe(result=>{

        if(result){
          this.path = '';
          this.path = '/assets/image/'+this.logreg.userId+'/'+this.logreg.userPicture;
        }
      })
    }
  }

  logout():void{

    this.logreg.logout();

  }

}
