import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class userService {

  public user: any

  public setUser(data: any) {
    this.user = data;    
  }

  public getUser() {
      return this.user;
  }

  public removeUser() {
      this.user = {}
  }
}
