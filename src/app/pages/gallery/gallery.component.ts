import { Component, OnInit } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { StorageService } from 'app/storage.service';
import { SupabaseService } from 'app/supabase.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images :any[] = [];
  image :any;
  constructor(
    private storageService :StorageService,
    private supabase :SupabaseService
    ) { }

  ngOnInit(): void {
    console.log("gallery component");
    this.storageService.download('photos', 'test.jpg').then((response) =>{
      console.log(response.data);
      const reader = new FileReader();
      reader.readAsDataURL(response.data);
      reader.onload = _event => {
        console.log("reader result: " + reader.result);
        this.images.push(reader.result);
        console.log("list:" + this.images);
        this.image = reader.result;
        console.log("single:" + this.image);
      // this.image.nativeElement.src = url; //image declared earlier
      };
    });


    this.supabase.getAllChallenges().then(ret=>{
      ret.forEach(challenge=>{
        if(challenge.path != "" && challenge.path != null){
          console.log(challenge.path);
          //display every image
        }
      })
    })

  }

}
