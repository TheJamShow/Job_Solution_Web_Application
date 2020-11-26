import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router,NavigationEnd } from "@angular/router";
import { LoginService } from "../login/login.service";
import { HrprofilePopupComponent } from '../hr-form/hrprofile-popup/hrprofile-popup.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-hr-form',
  templateUrl: './hr-form.component.html',
  styleUrls: ['./hr-form.component.css']
})
export class HrFormComponent implements OnInit {

  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  hr_id = "";
  firstName = "";
  lastName = "";
  phone = "";
  title = "";
  company = "";
  startDate = "";
  note = "";
  contacts = "";
  mySubscription:any;
  

  isLinear = false;

  selectedFile: File = null;

  constructor(
    private http: HttpClient,
    public route: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    public dialog: MatDialog
    ) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      
        this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Trick the Router into believing it's last link wasn't previously loaded
          this.router.navigated = false;
        }
      });
     }

  ngOnInit() {
    this.hr_id = this.loginService.getUserId();
    this.getHrInfo();
    this.loadImg();
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
  //get default info
  getHrInfo() {
    // console.log("client side:", this.hr_id);
    let req ={
      hr_num : this.hr_id,
    }
    this.http
      .post<{ message: string; account: Account }>(
        "http://localhost:3000/hr/get-profile" , req)
      .subscribe(AccountData => {
        this.firstName = AccountData["firstName"];
        this.lastName = AccountData["lastName"];
        this.phone = AccountData["phone"];
        this.title = AccountData["title"];
        this.company = AccountData["company"];
        this.startDate = AccountData["startDate"];
        this.note = AccountData["note"];
        this.contacts = AccountData["contacts"];
      })
  }
  //save update 
    SaveUpdate(){
      let req = {
        hr_id: this.hr_id,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        title: this.title,
        company: this.company,
        startDate: this.startDate,
        note: this.note,
        contacts: this.contacts
      };

      this.http
        .put("http://localhost:3000/hr/update/", req)
        .subscribe(response => {
          console.log("res is :", response);
        });
      this.openDialog();
    }

  openDialog(): void {
    const dialogRef = this.dialog.open(HrprofilePopupComponent, {
      width: '300px',
      height: '200px',
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  } 


  selectFile(event) {
    this.selectedFile = <File>event.target.files[0];
  }

  uploadBotton() {
    // console.log("id is :", this.hr_id);
    const userInfo: string = this.hr_id;

    const fd = new FormData();
    // const fd1 = new FormData();
    fd.append('userImage', this.selectedFile, userInfo);
    // fd1.append('userImage', this.selectedFile, this.selectedFile.name);
    
    // console.log(fd);
    this.http
      .post("http://localhost:3000/images/update-pic" ,fd)
      .subscribe(response => {
        console.log("res is :", response);
        this.router.navigate(['/hr-form']);
        this.mySubscription.unsubscribe();

      });
  }

  arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = [].slice.call(new Uint8Array(buffer));
    bytes.forEach((b) => binary += String.fromCharCode(b));
    return window.btoa(binary);
  };

  pic: any;

  loadImg(){
    let req = {
      userInfo: this.hr_id
    }
    this.http
      .post("http://localhost:3000/images/load-pic", req)
      .subscribe(data => {
        var base64Flag = 'data:image/jpeg;base64,';
        var imageStr = this.arrayBufferToBase64(data["img"].data.data);
        this.pic = base64Flag + imageStr;
      });
  }

}
