import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { Items } from '../mocks/providers/items';
import { Settings, User, Api, GlobalUtils } from '../providers';
import { MyApp } from './app.component';
import { MyWorkListPageModule } from '../pages/my-work-list/my-work-list.module';
import { MyAuditOrderPageModule } from '../pages/my-audit-order/my-audit-order.module';
import { MyBugReportListPageModule } from '../pages/mine-bug-report-list/my-bug-report-list.module';
import { MyDoingPageModule } from '../pages/my-doing/my-doing.module';
import { MyPredoingPageModule } from '../pages/my-predoing/my-predoing.module';
import { RepairReportPageModule } from '../pages/repair-report/repair-report.module';
import { RepairOrderPageModule } from '../pages/repair-order/repair-order.module';
import { ImagePageModule } from '../pages/image/image.module';
import { EquipmentListPageModule } from '../pages/equipment-list/equipment-list.module';
import { EquipmentInfoPageModule } from '../pages/equipment-detail/equipment-info.module';
import { MyOrderDetailPageModule } from '../pages/my-order-detail/my-order-detail.module';
import { MinePwdChangePageModule } from '../pages/mine-pwd-change/mine-pwd-change.module';
import { MineAboutUsPageModule } from '../pages/mine-about-us/mine-about-us.module';
import { MineRepairHistoryPageModule } from '../pages/mine-repair-history/mine-repair-history.module';
import { MyBugReportPageModule } from '../pages/mine-bug-report/my-bug-report.module';
import { AddRepairReportPageModule } from '../pages/add-repair-report/add-repair-report.module';

import { QRScanner } from "@ionic-native/qr-scanner";
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CallNumber } from '@ionic-native/call-number';
import { Camera } from "@ionic-native/camera";
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { StoreBugReportPageModule } from '../pages/store-bug-report/store-bug-report.module';
import { LoginPageModule } from '../pages/login/login.module';
import { Geolocation } from '@ionic-native/geolocation';
import { Media } from '@ionic-native/media';
import { Network } from "@ionic-native/network";
import { Device } from '@ionic-native/device';

import { NetworkProvider } from '../providers/utils/network-check-tool';
// import { GlobalToolProvider } from '../providers/global-tool/global-tool';
// import { HttpserviceProvider } from '../providers/httpservice/httpservice';
import { TakePhotoPageModule } from '../pages/take-photo/take-photo.module';
import { ScanPageModule } from '../pages/scan/scan.module';
// import { Http, HttpModule } from '../../node_modules/@angular/http';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
    }),
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      backButtonText: "",//按钮内容
      backButtonIcon: "ios-arrow-back",//按钮图标样式
      pageTransition: "ios",
      // mode:"ios"
    }),
    IonicStorageModule.forRoot(),
    //login
    LoginPageModule,

    //scan page
    ScanPageModule,

    // main subs
    MyWorkListPageModule,
    MyAuditOrderPageModule,
    MyDoingPageModule,
    MyPredoingPageModule,

    // store subs
    StoreBugReportPageModule,
    TakePhotoPageModule,

    // mine subs
    RepairReportPageModule, 
    RepairOrderPageModule,
    ImagePageModule,
    EquipmentListPageModule,
    EquipmentInfoPageModule,
    MyOrderDetailPageModule,

    MyBugReportListPageModule,
    MineRepairHistoryPageModule,
    MyBugReportPageModule,
    MinePwdChangePageModule,
    MineAboutUsPageModule,

    //inspect sub
    AddRepairReportPageModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    //providers
    Api,
    Items,
    User,
    NetworkProvider,//net check
    GlobalUtils,//physic back  btn
    // HttpserviceProvider,//http

    //plugins
    Camera,
    File,
    FileTransfer,
    FilePath,
    SplashScreen,
    StatusBar,
    GlobalUtils,
    QRScanner,
    Media,
    CallNumber,
    Geolocation,
    Network,
    Device,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // GlobalToolProvider,
    // HttpserviceProvider,
  ]
})
export class AppModule { }
