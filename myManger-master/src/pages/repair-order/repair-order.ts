import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders, HttpParams } from '../../../node_modules/@angular/common/http';
import { BaseUrl, personOrderDetail, qiangOrder, cancelOrder, OrderStateChange, uploadOrder } from '..';
import { Sms } from '../../models/sms';
import { MyWorker } from '../../models/worker';
import { OrderInfo } from '../../models/orderinfo';
import { Api } from '../../providers';

/**
 * Generated class for the RepairOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-repair-order',
  templateUrl: 'repair-order.html',
})
export class RepairOrderPage {
  date:any;
  type = "1";
  maiId;
  getOrderDetail = [];
  repair='请选择';
  showWorks: boolean = false;//显示人员
  getOrcancel: boolean = false;//抢单或取消
  startOrfinish: boolean = false;//开始维修或完成
  Classification:any;//故障类别
  faultLevel='请选择';//故障等级
  workerArr = [];//工作人员
  parts = [];//配件
  time: string = "";
  bugReason = "1";
  repairLevel = "1";
  descrption = "1";
  msg:any;
  state="1";
  timeLsst:any;
  nowData:any;
  dieTime:any;
  finally:any;
  dayDiff:any;
  hoursUse:any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private api: Api,
    private toast: ToastController,
    private loadingCtrl: LoadingController) {
    this.maiId = navParams.get('maiId');
    // if (this.maiId.length == null) {
    //   this.maiId = '2';
    // }
  }

  ionViewDidLoad() {//equivalence to $(document).ready(function(){})
    this.getOrderBaseInfo();
    // this.getWorkers();
  }
  nowDayTime() {
    this.date = new Date();
    this.nowData=new Date();;
    this.time = this.date.toLocaleDateString() + " " + (this.date.getHours() < 10 ? "0" + this.date.getHours() : this.date.getHours())
      + ":" + (this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes())
      + ":" + (this.date.getSeconds() < 10 ? "0" + this.date.getSeconds() : this.date.getSeconds());
  }
  commit(event) {

    let load = this.loadingCtrl.create();
    load.present();

    let header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', this.api.getToken());

    let params = new HttpParams()
      .set('maiId', this.maiId)
      .set('bugReason', this.bugReason)
      .set('repairLevel', this.repairLevel)
      .set('descrption', this.descrption);

    let options = { 
      headers: header,
      params: params
    }

    this.http.post<Sms<any>>(BaseUrl + uploadOrder, null, options).subscribe(res => {
      //提交工单接口，必要参数维修单id
      // if (this.checkTokenOutDate(res.code)) {
      //   this.goLogin(navCtrl);
      //   return
      // } else {
        // }
        setTimeout(() => {
          this.showToast('提交成功');
          load.dismiss();
          this.navCtrl.pop();
      }, 2000);
    }, err => {
      this.navCtrl.pop();
      load.dismiss();
    })
  }

  showToast(msg) {
    this.toast.create({
      duration: 2000,
      message: msg,
      position: 'bottom'
    }).present();
  }

  //抢单或者取消
  cancle(event) {
    if (this.getOrcancel) {//取消
      this.http.post(BaseUrl + cancelOrder, null, this.setParams()).subscribe(res => {
        this.getOrcancel = false;

      }, err => {
        console.log(err)
      });
    } else {//抢单
      this.http.post(BaseUrl + qiangOrder, null, this.setParams()).subscribe(res => {
        this.getOrcancel = true;
        console.log(res);

      }, err => {
        
      });
    }
  }
  
  //执行中或完成
  startOfinish() {
    if (this.startOrfinish) {//完成

      this.http.post(BaseUrl + OrderStateChange, null, this.setParams()).subscribe(res => {
        this.date = new Date();
        this.dieTime=new Date();
        this.timeLsst = this.date.toLocaleDateString() + " " + (this.date.getHours() < 10 ? "0" + this.date.getHours() : this.date.getHours())
          + ":" + (this.date.getMinutes() < 10 ? "0" + this.date.getMinutes() : this.date.getMinutes())
          + ":" + (this.date.getSeconds() < 10 ? "0" + this.date.getSeconds() : this.date.getSeconds());

        this.finishTimeValue();
          
      }, err => {
        alert(this.msg);
      });
    } else {//开始维修，执行中
      this.http.post(BaseUrl + OrderStateChange, null, this.setParams()).subscribe(res => {
        this.getOrcancel = true;
        this.startOrfinish=true;
        this.nowDayTime();
        this.state="2";
      }, err => {
        alert(this.msg);
      });
    }
  }
  finishTimeValue(){
    var ownFishTime=this.dieTime-this.nowData;//相差的毫秒数
    var dayDiff = Math.floor(ownFishTime / (24 * 3600 * 1000));//计算出相差天数
    var leave1=ownFishTime%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));//计算出小时数
    //计算相差分钟数
    var leave2=leave1%(3600*1000);    //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));//计算相差分钟数
    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    this.hoursUse=ownFishTime/(3600*1000);//计算出小时数
    this.finally=dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"
  }
  private setParams() {
    let header = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', this.api.getToken());

    let params = new HttpParams()
    .set('maiId', this.maiId)
    .set('state', this.state);

    let options = {
      headers: header,
      params: params
    };
    return options;
  }

  //维修单故障信息
  getOrderBaseInfo() {
    let load = this.loadingCtrl.create()
    load.present()
    this.http.post<Sms<any>>(BaseUrl + personOrderDetail, null, this.setParams()).subscribe((res) => {
      console.log(res);
      this.getOrderDetail=res.data
      console.log(this.getOrderDetail);
      load.dismiss()
    }, err => {
      load.dismiss()
      console.log(err)
    });
  }

  //维修状态选择
  repairStatus(event) {
    let a1 = this.alertCtrl.create();
    a1.setTitle('维修状态');
    a1.setMode('ios');
    a1.addInput({
      type: 'radio',
      label: '待维修',//3-待维修
      value: '待维修',
      handler: data => {
        this.repair = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '维修中',//4-ing
      value: '维修中',
      handler: data => {
        this.repair = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '完成维修',//5-结束
      value: '完成维修',
      handler: data => {
        this.repair = data.value;
        a1.dismiss();
      }
    });

    a1.present();
  }
  //故障类别
  repairfaultClassification(event) {
    let a1 = this.alertCtrl.create();
    a1.setTitle('故障类别');
    a1.setMode('ios');
    a1.addInput({
      type: 'radio',
      label: '待维修',//3-待维修
      value: '待维修',
      handler: data => {
        this.Classification = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '维修中',//4-ing
      value: '维修中',
      handler: data => {
        this.Classification = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '完成维修',//5-结束
      value: '完成维修',
      handler: data => {
        this.Classification = data.value;
        a1.dismiss();
      }
    });

    a1.present();
  }
  //故障等级
  repairFaultLevel(event) {
    let a1 = this.alertCtrl.create();
    a1.setTitle('维修等级');
    a1.setMode('ios');
    a1.addInput({
      type: 'radio',
      label: '轻微故障',//1-轻微故障
      value: '轻微故障',
      handler: data => {
        this.faultLevel = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '一般故障',//2-一般故障
      value: '一般故障',
      handler: data => {
        this.faultLevel = data.value;
        a1.dismiss();
      }
    });

    a1.addInput({
      type: 'radio',
      label: '严重故障',//3-严重故障
      value: '严重故障',
      handler: data => {
        this.faultLevel = data.value;
        a1.dismiss();
      }
    });

    a1.present();
  }
  list = [];
  //工人列表
  getWorkers() {
    // this.http.post(BaseUrl + personOrderDetail, options).subscribe((res:Sms<MyWorker[]>) => {
    //   this.showWorkerDialog(res.data);
    // }, err => {

    // });
    this.list = [{
      name: "123",
      userId: "221"
    }, {
      name: "123",
      userId: "222"
    }, {
      name: "123",
      userId: "223"
    }, {
      name: "123",
      userId: "224"
    }];
    this.showWorkerDialog();
  }

  //员工列表弹窗
  showWorkerDialog() {
    let alert = this.alertCtrl.create();
    alert.setTitle('请选择要增加的人员');

    for (var i = 0; i < this.list.length; i++) {
      alert.addInput({
        type: 'checkbox',
        label: this.list[i].name,
        value: this.list[i].userId,
        name: i
      });
    }

    alert.addButton('取消');
    alert.addButton({
      text: '确认',
      handler: data => {
        console.log('Checkbox data:', data);//value数组
        //添加人员list
        for (var i = 0; i < this.list.length; i++) {
          for (var j = 0; j < data.length; j++) {
            if (this.list[i].userId === data[j]) {
              this.workerArr.push(
                new MyWorker(this.list[i].userId, this.list[i].username, this.list[i].name)
              );
            }
          }
        }
        this.showWorks = true;
      }
    });
    alert.present();
  }

  //配件
  getParts() {

  }

  addWorkInfo(worker) {

  }
  
}
