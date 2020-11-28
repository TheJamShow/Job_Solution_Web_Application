import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { LoginService } from "./login.service";
import { ToastContainerDirective } from 'ngx-toastr';
import { ToastrService } from 'ngx-toastr';
// import { delay } from 'rxjs/operators';
// import { setTimeout } from 'timers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild(ToastContainerDirective, { static: true }) toastContainer: ToastContainerDirective;


  email: string;
  password: string;
  role: string;
  choice: any;
  selectedChoice: string;
  choices = [
    'HR',
    'Candidate',
  ];
  wrong: string;

  constructor(private http: HttpClient,
    private loginService: LoginService,
    public route: ActivatedRoute,
    private toastrService: ToastrService) { 
    }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }
  
  // this.isLoading = true;

  login(){
      this.role = this.choice;
      const res = this.loginService.login(this.email, this.password);
      console.log(res);
      if(!(res))
      {
        setTimeout(()=>{
          this.wrong = "Incorrect email and password combination";
        },1000);
        //console.log(this.wrong);
      }
       //this.onClick();
  }

  // onClick() {
  //   this.toastrService.error('wrong password or email must match');
  // }


  // retrivePassword() {
  //   // console.log("entered email: ",this.email); 
  //   this.loginService.retrivePassword(this.email);
  //   this.sent = true;
  // }

}
