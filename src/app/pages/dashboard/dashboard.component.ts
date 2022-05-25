import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import { Challenge } from 'app/model/challenge';
import { StorageService } from 'app/storage.service';
import {environment} from "../../../environments/environment";
import { SupabaseService } from "../../supabase.service";


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

  image :any;

  constructor(private readonly supabase: SupabaseService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer){
    this.checkBucketExists();
    this.message = null;
    this.status = false;
  }

  async ngOnInit(){
    this.challenges = await this.supabase.getAllChallenges();
    console.log(this.challenges);
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

    console.log("file:", file)
    console.log("name:", name)

    console.log("bucket:", this.bucket)


    this.storageService.upload(this.bucket, name, file).then((data) => {
      if (data.error) {
        this.message = `Error send message ${data.error.message}`;
      } else {
        console.log(data.data);
        this.message = `File ${file.name} uploaded with success!`;
        this.updateCardWithImage(id, name);
      }
      console.log("message:", this.message)
      this.status = false;
    });
  }

  updateCardWithImage(id:Number, name:string){
    this.storageService.download(this.bucket,name).then((blob)=>{
      let objectURL = URL.createObjectURL(blob.data);       
      this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }

  updateChallengeWithImage(path:string){
    
  }
}
