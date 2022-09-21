import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, SupabaseAuthService } from '../../supabase-auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  session: any;
  loading: boolean;
  user: IUser;

  constructor(private router: Router,
              private supabaseService: SupabaseAuthService,
              private authService:SupabaseAuthService) {
                this.session = this.supabaseService.getSession();
    this.loading = false;
    this.user = {} as IUser;

  }

  public signIn(): void {
    this.loading = true;
    this.supabaseService.signIn()
    .then(() => {
      console.log("Authenticated: " + this.authService.getSession().access_token);
    }).catch(() => {
      this.loading = false;
    });
  }


  public ngOnInit(): void {
    this.supabaseService.authChanges((_, session) => this.session = session);
  }

  public isAuthenticated(): boolean {
    if (this.session) {
      return true;
    }
    return false;
  }

  public signOut(): void {
    this.supabaseService.signOut()
    .then(() => {
      this.router.navigate(['/signIn']);
    });
  }
}