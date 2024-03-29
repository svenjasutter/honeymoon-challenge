import { Injectable } from '@angular/core';
import { AuthChangeEvent, createClient, Session, SupabaseClient, User } from '@supabase/supabase-js';

import { environment } from '../environments/environment';

export interface IUser {
  email: string;
  name: string;
  website: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {

  private supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  public getUser(): User|null {
    // console.log("u", this.supabaseClient.auth.user());
    return this.supabaseClient.auth.user();
  }

  public getSession(): Session|null {
    // console.log("s", this.supabaseClient.auth.session());
    return this.supabaseClient.auth.session();
  }

  public getProfile(): PromiseLike<any> {
    const user = this.getUser();

    return this.supabaseClient.from('profiles')
    .select('username, website, avatar_url')
    .eq('id', user?.id)
    .single();
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void): any {
    return this.supabaseClient.auth.onAuthStateChange(callback);
  }

  public signIn(email: string): Promise<any> {
  return this.supabaseClient.auth.signIn({
    email,
  }).then((ret)=>{
    // console.log("ret:",ret);
  });
}

  public signOut(): Promise<any> {
    return this.supabaseClient.auth.signOut();
  }

  public updateProfile(userUpdate: IUser): any {
    const user = this.getUser();

    const update = {
      username: userUpdate.name,
      website: userUpdate.website,
      id: user?.id,
      updated_at: new Date(),
    };

    return this.supabaseClient.from('profiles').upsert(update, {
      returning: 'minimal', // Do not return the value after inserting
    });
  }

}