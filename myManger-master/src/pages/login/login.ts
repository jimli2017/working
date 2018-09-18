import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User, Api } from '../../providers';
import { MainPage, BaseUrl, loginUrl, checkCodeUrl } from '../';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Device } from '@ionic-native/device';

import { Sms } from '../../models/sms';
// import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the tel field with or without email, make
  // sure to add it to the type
  account: { tel: string, token: string } = {
    tel: '',
    token: '',
  };
  img: any;
  checkCode: string;
  uuid;
  pwd = '';
  // Our translated text strings
  // private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public device: Device,
    private storge: Storage,
    private api: Api) {


  }

  ionViewDidLoad() {
    this.uuid = this.device.uuid;
    this.getSms();
    this.getAccount();
  }

  private getAccount() {
    this.storge.get('account').then((user) => {
      if (user) {
        console.log(user['token']);
        this.account = user;
      }
    });
  }

  getSms() {
    if (this.uuid == null) {
      this.uuid = 'g3dfsarte'
    }
    let httpParams = new HttpParams().set("machineCode", this.uuid);
    this.http.post(BaseUrl + checkCodeUrl, httpParams).subscribe((res: Sms<any>) => {
      this.img = res.data;
    }, err => {

    });
  }

  refreshCode() {
    this.getSms();
  }

  // Attempt to login in through our User service
  doLogin() {
    if (this.account.tel.length == 0 || this.pwd.length == 0) {
      this.toastCtrl.create({
        message: '用户名或密码不能为空',
        duration: 2000,
        position: 'bottom'
      }).present();
      return
    }
    let currentIndex = this.navCtrl.getActive().index;

    let httpParams = new HttpParams()
      .set("machineCode", this.uuid)
      .set("userCode", this.account.tel)
      .set("password", this.pwd)
      .set("checkCode", this.checkCode);
    // .set("source", this.device.platform);
    this.http.post(BaseUrl + loginUrl, httpParams).subscribe((res: Sms<any>) => {
      if (res.code == 0) {
        this.api.setToken(res.data);
        this.account.token = 'Bearer '+res.data;
        this.storge.set('account', this.account).then(() => {
          console.log('saved')
        })

        this.navCtrl.push(MainPage).then(() => {
          this.navCtrl.remove(currentIndex);
        });

      } else if (res.code == 1231) {
        // this.http.showToast('验证码错误');
        this.toastCtrl.create({
          message: '验证码错误',
          duration: 2000,
          position: 'bottom'
        }).present();

      }
    }, err => {
      // this.http.handleError(err);
      console.log(err)
    })

  }

  // //退出应用方法
  // private showExit(): void {
  //   //如果为true，退出
  //   if (this.backButtonPressed) {
  //     this.platform.exitApp();
  //   } else {
  //     //第一次按，弹出Toast
  //     this.toastCtrl.create({
  //       message: '再按一次退出应用',
  //       duration: 2000,
  //       position: 'bottom'
  //     }).present();
  //     //标记为true
  //     this.backButtonPressed = true;
  //     //两秒后标记为false，如果退出的话，就不会执行了
  //     setTimeout(() => this.backButtonPressed = false, 2000);
  //   }
  // }
}
