import { TranslateService } from '@ngx-translate/core';
import { ToastrService, Toast } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { PaymentChannel } from '../enums/set.enum';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class SharedService {
    // public themeChange = new BehaviorSubject<any>('');

    constructor(
        private toastr: ToastrService,
        private translate: TranslateService
    ) { }

    // pbdf = paybros default theme
    // pbwl = paybros white label theme

    public decodedData = JSON.parse(sessionStorage.getItem('decodedData'));
    // private defaultTheme = 'pbdf';
    private defaultTheme = 'pbesk';
    private IsWhiteLabel = this.decodedData == null ? false : this.decodedData.IsWhiteLabel;

    public currentTheme = this.IsWhiteLabel ? 'pbwl' : this.defaultTheme;
    public wlThemeStatus = this.currentTheme === 'pbwl';


    public theme = {
        logo: this.wlThemeStatus ? true : false,
        sss: this.wlThemeStatus ? true : false,
        hidden: this.wlThemeStatus ? true : false
    };

    CurrentLang() {
        let Lang = 'tr-TR';
        if (sessionStorage.getItem('Set') != null) {
            Lang = JSON.parse(sessionStorage.getItem('Set')).Lang;
        }
        return Lang;
    }

    ToastrMessage(status, content) {
        this.translate.get(content).subscribe((res: string) => {
            const settings = {
                progressBar: true,
                timeOut: 5000,
                extendedTimeOut: 3000
            };
            switch (status) {
                case 'success':
                    this.toastr.success(res, '', settings);
                    break;
                case 'warning':
                    this.toastr.warning(res, '', settings);
                    break;
                case 'info':
                    this.toastr.info(res, '', settings);
                    break;
                case 'error':
                    this.toastr.error(res, '', settings);
                    break;
                default:
                    this.toastr.info(content, '', settings);
                    break;
            }
        });

    }

    GetPaymentChannelOptions() {
        let Lang = 'en-US';
        if (sessionStorage.getItem('Set') != null) {
            Lang = JSON.parse(sessionStorage.getItem('Set')).Lang;
        }
        let PaymentChannelOptions = {
            Name: 'Ödeme',
            NameEN: 'Payment',
            Class: 'operator-logo-hidden',
            icon: 'cc'
        };
        switch (this.decodedData.PaymentChannel.Id) {
            case PaymentChannel.Credid_Card_Payment:
                PaymentChannelOptions = {
                    Name: 'Kredi Kartı Ödeme',
                    NameEN: 'Credit Card Payment',
                    Class: 'operator-logo-hidden',
                    icon: 'cc'
                };
                break;
            case PaymentChannel.Mobile_Payment:
                PaymentChannelOptions = {
                    Name: 'Mobil Ödeme',
                    NameEN: 'Mobile Payment',
                    Class: 'cc-logo-hidden',
                    icon: 'mobil'
                };
                break;
            case PaymentChannel.TopUpDeposit:
                PaymentChannelOptions = {
                    Name: 'Havale İşlemi',
                    NameEN: 'Mobil Ödeme',
                    Class: 'operator-logo-hidden',
                    icon: 'cc'
                };
                break;
            default:
                PaymentChannelOptions = {
                    Name: 'Ödeme',
                    NameEN: 'Payment',
                    Class: 'operator-logo-hidden',
                    icon: 'cc'
                };
                break;
        }
        return {
            Name: Lang === 'tr-TR' ? PaymentChannelOptions.Name : PaymentChannelOptions.NameEN,
            Class: PaymentChannelOptions.Class,
            Icon: PaymentChannelOptions.icon
        };
    }

}
