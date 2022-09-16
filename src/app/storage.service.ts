import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }

   async upload(bucket: string, path: string, file: File) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file);
    return { data, error };
  }
  
  async download(bucket: string, path: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .download(path);

    return { data, error };
  }

  async createBucket() {
    const { data, error } = await this.supabase.storage.createBucket('photos');
    return { data, error };
  }

  async getBucket() {
    const { data, error } = await this.supabase.storage.getBucket('photos');
    return { data, error };
  }

  async deletePhotoFromBucket(path: string){
    const { data, error } = await this.supabase.storage
  .from('photos')
  .remove([path]);
  }

}