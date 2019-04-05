import { SharedService } from './shared.service';
import { Response } from '@angular/http';
import { Injectable, ErrorHandler } from '@angular/core';
import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';



@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    constructor(
        public ss: SharedService
    ) { }

    handleError(e: Response) {
        return throwError(e.json().error);
    }


}

// PasswordsDontMatch = 1301,
//         LengthIsShort = 1302,
//         LengthIsTooLong = 1303,
//         AtLeast1LowerCase1UpperCase1Number = 1304,
//         WrongCredentials = 1305,
//         PasswordNotFound = 1306,
//         OTPCodeNotVerified = 1307,
//         LeaseTimeExpired = 1308
// RequestNotFound = 1201,
//         KeyNotFound = 1202,
//         MerchantNotFound = 1203,
//         Merchantkeynotfound = 1204,
//         CurrencyNotFound = 1205,
//         RequestnNullorVerificationFailed = 1206,
//         ParsErrror = 1207,
//         PaymentMethodNotPermitted =1208,
//         ThisRequestAlreadyUsed =1209,
//         PaymentResponseItemisNull =1210,
// GeneralError = 1001,
//         SaveError = 1002,
//         NoDataError = 1003
