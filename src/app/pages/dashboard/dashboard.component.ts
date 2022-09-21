import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import { Challenge } from 'app/model/challenge';
import { StorageService } from 'app/storage.service';
import { SupabaseAuthService } from 'app/supabase-auth.service';
import { sign } from 'crypto';
import * as internal from 'stream';
import {environment} from "../../../environments/environment";
import { SupabaseService } from "../../supabase.service";
import { ToastService } from '../toast/toast.service';
import Swal from 'sweetalert2'


@Component({
    selector: 'dashboard-cmp',
    moduleId: module.id,
    templateUrl: 'dashboard.component.html'
})


export class DashboardComponent implements OnInit{

  public canvas : any;
  public challenges :Challenge[];

  message: string;
  status: boolean;
  bucket: string;

  countCompleted :Number;
  countOpen :Number;
  balance :number;

  constructor(private readonly supabase: SupabaseService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private toastService: ToastService,
    private authService:SupabaseAuthService,
    private router: Router){
    this.checkBucketExists();
    this.message = null;
    this.status = false;
  }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  async ngOnInit(){

    this.challenges = await this.supabase.getAllChallenges();
    /* Load Images if exists */
    this.challenges.forEach(async challenge=>{
      if(challenge.path != null && challenge.path != ""){
        // console.log("Challenge: ", challenge.title)
        await this.getImageFromPath(challenge.path, challenge);

        
      }
    })
    /* Update Widgets */
    this.getCountsChallenges()
    this.getBalance()

    // console.log("challenges:",this.challenges);

    // if(this.authService.getSession()){
      
    // }
    // else{
    //   console.log("not logged in");
    //   this.router.navigate(['signIn']);
    // }
  }

  checkBucketExists() {
    this.storageService.getBucket().then((data) => {
      if (!data.data) {
        this.storageService.createBucket().then((data) => {
          if (data.error) {
            console.log(`Erro at create bucket: ${data.error.message}`);
          } else {
            console.log('create bucket photos');
            this.bucket = 'photos';
          }
        });
      } else {
        this.bucket = data.data.name;
        console.log(`bucket ${this.bucket} exists.`);
      }
    });
  }

  selectFile(event: Event, id) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length == 0) {
      this.message = 'You must select an image to upload.';
      return;
    }

    this.status = true;
    const file: File = input.files[0];
    const name = file.name.replace(/ /g, '');

    // console.log("file:", file)
    // console.log("name:", name)

    // console.log("bucket:", this.bucket)


    this.storageService.upload(this.bucket, name, file).then((data) => {
      if (data.error) {
        /*Upload failed*/
        // this.message = `Error send message ${data.error.message}`;
        this.toastService.show(`Error: ${data.error.message}`, {
          delay: 7000,
          autohide: true,
          classname: 'bg-danger text-light',
        });
      } else {
        /*Upload success*/

        this.toastService.show(`File ${file.name} uploaded with success!`, {
          delay: 7000,
          autohide: true,
          classname: 'bg-success text-light',
        });

        Swal.fire({
          title: 'Congratulation!',
          text: 'Die Challenge ist abgeschlossen. Das Bild wurde der Gallerie hinzugefügt.',
          width: 600,
          padding: '3em',
          color: '#716add',
          background: '#fff',
          backdrop: `
            rgba(0,0,123,0.4)
            url("../../../assets/img/nyan-cat.gif")
            left top
            no-repeat
          `
        })

        // this.message = `File ${file.name} uploaded with success!`;
        // this.updateCardWithImage(id, name);
        this.updateChallengeWithImageAndDone(id, name);
        this.ngOnInit();
      }
      // console.log("message:", this.message)
      this.status = false;
      this.ngOnInit();
    });
  }

  /* NOT WORKING!!! */
  updateCardWithImage(id:Number, name:string){
    /* Get uploaded Image from Challenge */
    this.storageService.download(this.bucket,name).then((blob)=>{
      let objectURL = URL.createObjectURL(blob.data);       
      var c = this.challenges.find(x=>x.id = id);
      c.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }

  updateChallengeWithImageAndDone(id:number, path:string){
    var c = this.challenges.find(x => x.id = id);
    console.log("complete this challenge:", c)
    this.supabase.completeChallenge(c, path);
  }

  async revertChallenge(id:number){
    await this.supabase.deletePhotoById(id).then(
      x=>{
        console.log("Revert challenge" + id);
        this.supabase.revertChallenge(id);
        this.ngOnInit();
      }
    );
    this.ngOnInit();
  }

  //#region Widgets
    getCountsChallenges(){
      this.supabase.countChallenges(true).then(count=>{
        this.countCompleted = count;
      })
      this.supabase.countChallenges(false).then(count=>{
        this.countOpen = count;
      })
    }

    getBalance(){
      this.balance = 0;
      this.supabase.getAllChallenges().then(ret=>{
        ret.forEach(challenge=>{
          if(challenge.done){
            this.balance += challenge.profit;
          }
        })
      })
    }

    getImageFromPath(path:string, c:Challenge){
      this.storageService.download(this.bucket,path).then((ret)=>{
        var binaryData = [];
        binaryData.push(ret.data);
        let objectURL = URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}));
        c.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        // console.log("imagee",c.image);
      })
    }
  //#endregion
  

}
