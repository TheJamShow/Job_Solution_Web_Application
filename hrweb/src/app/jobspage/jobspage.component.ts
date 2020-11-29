import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Router,NavigationEnd } from "@angular/router";

import { JobspagePopupComponent } from './jobspage-popup/jobspage-popup.component';
import { LoginService } from "../login/login.service";
import { JobService } from "./job.service";

interface josbtype {
  value: string;
  viewValue: string;
}

interface location {
  value: string;
  viewValue: string;
}

interface industry {
  value: string;
  viewValue: string;
}
//If you have data passed from dialog
export interface DialogData {
  jobId: string,
  jobTitle: string,
  jobType: string,
  location: string,
  industryType: string,
  company: string,
  expirationDate: Date 
}

@Component({
  selector: 'app-jobspage',
  templateUrl: './jobspage.component.html',
  styleUrls: ['./jobspage.component.css']
})
export class JobspageComponent implements OnInit {

  jobtypes: josbtype[] = [
    {value: 'Internship', viewValue: 'Internship'},
    {value: 'Co-op', viewValue: 'Co-op'},
    {value: 'Full Time', viewValue: 'Full Time'},
    {value: 'Part Time', viewValue: 'Part Time'}
  ];
  
  locations: location[] = [
    { value: 'Mumbai', viewValue: 'Mumbai' },
    { value: 'Delhi', viewValue: 'Delhi' },
    { value: 'Bangalore', viewValue: 'Bangalore' },
    { value: 'Hyderabad', viewValue: 'Hyderabad' },
    { value: 'Kolkata', viewValue: 'Kolkata' },
    { value: 'Gandhinagar', viewValue: 'Gandhinagar' },
  ];
  

  industries: industry[] = [
    {value: 'Financial Service', viewValue: 'Financial Service'},
    {value: 'Accounting', viewValue: 'Accounting'},
    {value: 'Manufacturing', viewValue: 'Manufacturing'},
    {value: 'Real estate/ Construction', viewValue: 'Real estate/Construction'},
    {value: 'Marketing/Advertising/PR', viewValue: 'Marketing/Advertising/PR'},
    {value: 'Government/Education', viewValue: 'Government/Education'},
    {value: 'Consulting', viewValue: 'Consulting'},
    {value: 'Pharma/Biotech', viewValue: 'Pharma/Biotech'},
    {value: 'Technology/Science', viewValue: 'Technology/Science'},
    {value: 'Healthcare', viewValue: 'Healthcare'},
    {value: 'Aerospace', viewValue: 'Aerospace'},
    {value: 'Legal', viewValue: 'Legal'},
    {value: 'Transportation/Logistics', viewValue: 'Transportation/Logistics'},
    {value: 'Energy', viewValue: 'Energy'},
    {value: 'Sports/leisure', viewValue: 'Sports/leisure'},
    {value: 'Others', viewValue: 'Others'}
  ];

  enteredjobTitle = "";
  enteredjobType = "";
  enteredlocation = "";
  enteredindustryType = "";
  enteredcompany = "";
  enteredjobDescription = "";

  //found = false;
  jobTitle: any;
  jobType: any;
  location: any;
  industryType: any;
  job: any;
  jobDescription: any;
  userId: string;
  mySubscription:any;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private jobService: JobService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router : Router,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
      this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    })
   }

  ngOnInit() {
    this.userId = this.loginService.getUserId();
    console.log("user_id is: " + this.userId);
    this.searchJob(null);
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }


  searchJob(form: NgForm) {
    //console.log(this.enteredjobTitle)
    let req = { 
      jobTitle: this.enteredjobTitle, 
      jobType: this.enteredjobType, 
      location: this.enteredlocation, 
      industryType: this.enteredindustryType
    };
    console.log("front end :" , req);
    this.http
      .post("http://localhost:3000/searchjob", req)
      .subscribe(postData => {
        this.job = postData;
        console.log(this.job);
      });

    console.log("the search function will return the job_id, so you can use it in the application form submit");
  }

  applyJob(j){
    // console.log("j: "+ j);
    this.jobService.setJobId(j.job_id);
    this.jobService.setJobTitle(j.title);
    this.jobService.setJobCompany(j.company);
    this.jobService.setJobType(j.jobType);
    this.jobService.setJobLocation(j.location);
    this.jobService.setJobDescription(j.description);
    this.jobService.setJobIndustryType(j.industryType);
    this.jobService.setJobExpirationDate(j.expirationDate);
  }

  openDialog(j): void {
    const dialogRef = this.dialog.open(JobspagePopupComponent, {
      width: 'auto',
      height: 'auto',
      data: { 
        jobId: j.job_id,
        jobTitle: j.title, 
        company: j.company, 
        jobType: j.jobType, 
        location: j.location, 
        industryType: j.industryType, 
        jobDescription: j.jobDescription,
        expirationDate: j.expirationDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //this.jobTitle = result;
    });
  }
  
  resetSearch(){
    this.router.navigate(['/jobspage']);
        // this.ngOnInit();
    this.mySubscription.unsubscribe();

  }

}


