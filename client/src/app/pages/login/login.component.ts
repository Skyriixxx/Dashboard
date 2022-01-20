import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { userService } from 'src/app/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup
  public socialUser!: SocialUser;
  public isLoggedin!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private user: userService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
        username: [''],
        password: ['']
    });

    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
    });
  }

  public login() {
      console.log(this.loginForm.value.username);
      console.log(this.loginForm.value.password);
      this.http.post<any>("http://localhost:8081/api/auth/login",
        { username: this.loginForm.value.username, password: this.loginForm.value.password },
        { headers: this.buildHttpHeaders() }
      )
      .subscribe(res => {
          console.log(res); 
          this.loginForm.reset();
          this.user.setUser(res);
          this.router.navigate(['home/' + res.username]);
        }, err => {
        console.log(err);
        if (err.status == 400) {
          alert("User doesn't exist");
        }
      })
  }

  private buildHttpHeaders(): HttpHeaders {
    const header = {
      'Content-Type': 'application/json'
    };
    return new HttpHeaders(header);
  }


  public loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.router.navigate(['home']);
  }

  public logOut(): void {
    if (this.isLoggedin) {
      this.socialAuthService.signOut();
      this.router.navigate(['login']);
    }
  }

}
