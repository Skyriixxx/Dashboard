import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public signupForm !: FormGroup;
  constructor(private formBuilder : FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
        username: [''],
        password: ['']
    })
  }

  signUp() {
      console.log(this.signupForm.value);
      this.http.post<any>("http://localhost:8081/api/auth/register", { username: this.signupForm.value.username, password: this.signupForm.value.password })
      .subscribe(res => {
        alert("Sign Up Successful");
        this.signupForm.reset();
        this.router.navigate(['login']);
      }, err =>  {
        console.log(err);
        alert("Something went wrong");
        this.router.navigate(['login']);
      })
    }
}
