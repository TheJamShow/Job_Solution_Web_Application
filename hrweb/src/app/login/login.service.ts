import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, throwError } from "rxjs";
import { LoginData } from "./login_data.model";
import { Observable  } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: "root" })
export class LoginService {
    private isAuthenticated = false;
    private token: string;
    private tokenTimer: any;
    private userId: string;
    private userEmail: string;
    private userRole: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) { }

    getToken() {
        return this.token;
    }

    getIsAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    getAuthValid(response){
            console.log("response",response);
            const token = response.token;
            this.token = token;
            console.log(token);
            if (token) {
                const expiresInDuration = response.expiresIn;
                this.setAuthTimer(expiresInDuration);
                this.isAuthenticated = true;
                this.userId = response.userId;
                this.userRole = response.userRole;
                this.authStatusListener.next(true);
                const now = new Date();
                const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                console.log("role: " ,this.userRole);
                console.log("token: " ,token);
                this.saveAuthData(token, expirationDate, this.userId);
                console.log(this.userRole);
                if(this.userRole == 'HR'){
                    this.router.navigate(["/view-posting"]);
                }
                else if (this.userRole == 'Candidate'){
                    this.router.navigate(["/jobspage"]);
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
    }

    async login(email: string, password: string)  {
        const authData: LoginData = { email: email, password: password,role:null};
        const resp = <object> await this.http
            .post<{ token: string; expiresIn: number, userId: string, userRole: string}>(
                "http://localhost:3000/login",
                // "login",
                authData
<<<<<<< HEAD
            )
            .subscribe(response => {
                console.log(response);
                const token = response.token;
                this.token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.userRole = response.userRole;
                    this.authStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    console.log("role: " ,this.userRole);
                    console.log("token: " ,token);
                    this.saveAuthData(token, expirationDate, this.userId);
                    console.log(this.userRole);
                    if(this.userRole == 'HR'){
                        this.router.navigate(["/view-posting"]);
                    }
                    else if (this.userRole == 'Candidate'){
                        this.router.navigate(["/jobspage"]);
                    }
                    else{
                        return false;
                    }
                }
                else{
                    return false;
                }
            },err => {
                console.log("err");
                return false;
            });
            return false;
=======
            ).toPromise()
        if(resp){
            console.log(resp);
            return(this.getAuthValid(resp));

        }
        else{
            return false;
        }
    
            // .subscribe(response => {
            //     console.log("response",response);
            //     const token = response.token;
            //     this.token = token;
            //     console.log(token);
            //     if (token) {
            //         const expiresInDuration = response.expiresIn;
            //         this.setAuthTimer(expiresInDuration);
            //         this.isAuthenticated = true;
            //         this.userId = response.userId;
            //         this.userRole = response.userRole;
            //         this.authStatusListener.next(true);
            //         const now = new Date();
            //         const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            //         console.log("role: " ,this.userRole);
            //         console.log("token: " ,token);
            //         this.saveAuthData(token, expirationDate, this.userId);
            //         console.log(this.userRole);
            //         if(this.userRole == 'HR'){
            //             this.router.navigate(["/view-posting"]);
            //         }
            //         else if (this.userRole == 'Candidate'){
            //             this.router.navigate(["/jobspage"]);
            //         }
            //         else{
            //             return false;
            //         }
            //     }
            //     else{
            //         return false;
            //     }
            // },err => {
            //     console.log('err');
            //     return false;
            // });

            // console.log('true');
            // return true;
>>>>>>> 418bdabc94bf83306bd67f1a251950a30b6b48ee
    }

    getUserEmail() {
        return this.userEmail;
    }     /// added by sharmi -- still under testing

    autoAuthUser() {
        const authInformation = this.getAuthData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInformation.token;
            this.isAuthenticated = true;
            this.userId = authInformation.userId;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.router.navigate(["/"]);
    }

    private setAuthTimer(duration: number) {
        console.log("Setting timer: " + duration);
        this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());
        localStorage.setItem("userId", userId);
    }

    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        localStorage.removeItem("userId");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        const userId = localStorage.getItem("userId");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate),
            userId: userId
        }
    }

    newPassword(body): Observable<any> {
        return this.http.post('http://localhost:3000/reset', body);
        // return this.http.post('reset', body);
    }

    ValidPasswordToken(body): Observable<any> {
        return this.http.post('http://localhost:3000/valid', body);
        // return this.http.post('valid', body);
    }
}
