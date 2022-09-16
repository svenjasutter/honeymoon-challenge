import { Injectable } from '@angular/core';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../environments/environment";
 import { Challenge } from "../app/model/challenge";
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor(private storageService: StorageService,) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
   }

  async getAllChallenges(): Promise<Challenge[]> {
    var challengelist = [] as Array<Challenge>;
    const { data, error } = await this.supabase
      .from<Challenge>('challenge')
      .select();
    data?.forEach((challenge) => {
      var challenge: Challenge = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        profit: challenge.profit,
        difficulty: challenge.difficulty,
        done: challenge.done,
        path: challenge.path,
        image: null
      };
      challengelist.push(challenge);
    });
    challengelist.forEach(element => {
      // console.log(element.id + ":" + element.title);
    });
    return challengelist;
  }

  async completeChallenge(challenge:Challenge, path:string){
    console.log("pathhhh", path)
    console.log("chall", challenge)
    const update = {
      path: path,
      done: true
    };

    await this.supabase
      .from('challenge')
      .update(update)
      .match({id: challenge.id})
      .then(a=>{
        console.log("data after update:",a);
      }) 
  }

  async revertChallenge(challengeid:Number){
    const update = {
      done: false,
      path: null,
    };
    await this.supabase
      .from('challenge')
      .update(update)
      .match({id: challengeid})
      .then(a=>{
        console.log("data after revert:",a);
      });
  }

  async deletePhotoById(idChallenge:Number){
    const { data, error } = await this.supabase
      .from<Challenge>('challenge')
      .select();
    data?.forEach((challenge) => {
      if (challenge.id == idChallenge){
        console.log("delete path: " + challenge.path + challenge.id+ challenge.title);
        this.storageService.deletePhotoFromBucket(challenge.path);
        
      }
    });
  }

  //#region Widgets
  async countChallenges(done:Boolean):Promise<Number>{
    const { data, error } = await this.supabase
      .from('challenge')
      .select()
      .eq('done', done)
    return data.length;
  }
  //#endregion
}
