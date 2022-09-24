import { Component, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from 'app/storage.service';
import { SupabaseService } from 'app/supabase.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  imageCounter:number = 1;
  image1 :any; image2 :any; image3 :any; image4 :any; image5 :any; image6 :any;
  image7 :any; image8 :any; image9 :any; image10 :any; image11 :any; image12 :any;
  

  constructor(
    private storageService :StorageService,
    private supabase :SupabaseService
    ) { }

  ngOnInit(): void {
    this.imageCounter = 1;
    this.supabase.getAllChallenges().then(ret=>{
      ret.forEach(challenge=>{
        if(challenge.path != "" && challenge.path != null){
          // console.log(challenge.path);
          //display every image
          this.downloadImage(challenge.path);
        }
      })
    })

  }

  async downloadImage(path:string){
    await this.storageService.download('photos', path).then((response) =>{
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = _event => {
        var localImage = "image" + this.imageCounter.toString()
        // console.log(localImage);
        this[localImage] = reader.result;
        // console.log('single:' + this[localImage]);

        this.imageCounter++;
      };
    });
  }

}
