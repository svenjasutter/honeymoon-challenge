import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser, SupabaseAuthService } from '../../supabase-auth.service';
import Swal from 'sweetalert2'


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
              private supabaseService: SupabaseAuthService) {
                this.session = this.supabaseService.getSession();
    this.loading = false;
    this.user = {} as IUser;

  }

  public signIn(): void {
    this.loading = true;
    this.supabaseService.signIn(this.user.email)
    .then(() => {
    }).catch(() => {
      this.loading = false;
    });

    Swal.fire(
      'Willkommen!',
      'Der Zugangslink wurde dir per Mail zugesendet. Dieser Tab kann nun geschlossen werden.',
      'success'
    )

    window.self.close(); 


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