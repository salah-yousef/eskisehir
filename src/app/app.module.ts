import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pipes
import { TruncatePipe } from './pipe/truncate.pipe';
import { MaskPipe } from './pipe/mask.pipe';
import { SafeUrlPipe } from './pipe/safeUrl.pipe';

import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JustgageModule } from 'angular2-justgage';
import { CurrencyPipe } from '@angular/common';
import { SignalRModule, SignalRConfiguration } from 'ng2-signalr';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

import { ErrorHandlerService } from './services/error-handler.service';

// ngx bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PopoverModule } from 'ngx-bootstrap/popover';
// Guards
import { TokenGuards } from './guards/token.guards';
import { MobileGuard } from './guards/mobile.guard';
import { CcGuard } from './guards/cc.guard';
import { PhoneGuard } from './guards/phone.guard';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './Home/Home.component';
import { LoginCCComponent } from './login/login.component';
import { MobileApprovalComponent } from './mobile-approval/mobile-approval.component';
import { FooterRightComponent } from './footer-right/footer-right.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FooterLeftComponent } from './footer-left/footer-left.component';
import { ResultComponent } from './result/result.component';
import { CartComponent } from './cart/cart.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginApprovalComponent } from './login-approval/login-approval.component';
import { CcInfoComponent } from './cc-info/cc-info.component';
import { CcScureComponent } from './cc-scure/cc-scure.component';
import { CcConfirmComponent } from './cc-confirm/cc-confirm.component';
import { FullpageComponent } from './fullpage/fullpage.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthService } from './services/auth.service';
import { LoadingComponent } from './loading/loading.component';
import { GlobalErrorHandler } from './models/global-error-handler';
import { AuthorizeGuard } from './guards/authorize.guard';
import { BankTransferComponent } from './bank-transfer/bank-transfer.component';
import { BanksComponent } from './banks/banks.component';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedService } from './services/shared.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CreditCardDirectivesModule } from 'angular-cc-library';
import { SelectComponent } from './select/select.component';
import { EskisehirComponent } from './eskisehir/eskisehir.component';
import { DonatorFormComponent } from './donator-form/donator-form.component';
import { CanvasGuard } from './guards/canvas.guard';

registerLocaleData(localeTr, 'tr');
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const routes: Routes = [
  {
    path: 'cc', component: FullpageComponent, children: [
      { path: 'secure', component: CcScureComponent, canActivate: [TokenGuards, CcGuard, AuthorizeGuard] }
    ]
  },
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'paybros', pathMatch: 'full' },
      { path: 'paybros', component: HomeComponent },
      { path: 'mobile/approval', component: MobileApprovalComponent, canActivate: [TokenGuards, AuthorizeGuard] },
      { path: 'login', component: LoginCCComponent, canActivate: [TokenGuards] },
      { path: 'login/approval', component: LoginApprovalComponent, canActivate: [TokenGuards] },
      { path: 'cc/info', component: CcInfoComponent, canActivate: [TokenGuards, CcGuard, AuthorizeGuard] },
      { path: 'cc/confirm', component: CcConfirmComponent },
      { path: 'banktransfer', component: BankTransferComponent },
      { path: 'result', component: ResultComponent, canActivate: [TokenGuards] },
      { path: 'error/:errorCode', component: NotFoundComponent },
      { path: 'select', component: SelectComponent },
      { path: 'eskisehir/:paymentType', component: EskisehirComponent },
      { path: 'eskisehir', component: EskisehirComponent },
      { path: 'donator', component: DonatorFormComponent, canActivate:[CanvasGuard]},
      { path: '**', component: NotFoundComponent }
    ]
  },
  { path: '', redirectTo: 'paybros', pathMatch: 'full' }

];



export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  // c.logging = false;
  // c.withCredentials = true;
  return c;
}



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginCCComponent,
    MobileApprovalComponent,
    FooterRightComponent,
    FooterLeftComponent,
    ResultComponent,
    CartComponent,
    BanksComponent,
    NotFoundComponent,
    TruncatePipe,
    MaskPipe,
    SafeUrlPipe,
    LoginApprovalComponent,
    CcInfoComponent,
    CcScureComponent,
    FullpageComponent,
    LayoutComponent,
    CcConfirmComponent,
    LoadingComponent,
    BankTransferComponent,
    SelectComponent,
    EskisehirComponent,
    DonatorFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    TextMaskModule,
    JustgageModule,
    CreditCardDirectivesModule,
    RouterModule.forRoot(routes),
    SignalRModule.forRoot(createConfig),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    PopoverModule.forRoot(),
    CarouselModule.forRoot(),
    NgxIntlTelInputModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    TokenGuards,
    MobileGuard,
    CcGuard,
    PhoneGuard,
    AuthorizeGuard,
    AuthService,
    ErrorHandlerService,
    SharedService,
    CurrencyPipe,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: LOCALE_ID, useValue: 'tr-TR' }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
