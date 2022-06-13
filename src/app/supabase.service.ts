import { Injectable } from '@angular/core';
import {AuthChangeEvent, createClient, Session, SupabaseClient} from '@supabase/supabase-js';
import {environment} from "../environments/environment";
 import { Challenge } from "../app/model/challenge";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  constructor() {
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
    // console.log(challengelist);
    return challengelist;
  }

  async completeChallenge(challege:Challenge, path:string){
    console.log("pathhhh", path)
    console.log("chall", challege)
    const update = {
      path: path,
      done: true
    };

    await this.supabase
      .from('challenge')
      .update(update)
      .match({id: challege.id})
      .then(a=>{
        console.log("data after update:",a);
      }) 
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
