import { environment } from './../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { SignalR, SignalRConnection, IConnectionOptions, ConnectionStatus } from 'ng2-signalr';


@Injectable()
export class SignalrService {

    constructor() { }

}

@Injectable()
export class SignalRService {
    private connection: SignalRConnection;
    private connectionStatus: ConnectionStatus;
    public smsReceived: EventEmitter<any> = new EventEmitter<any>();
    public ccPaymentStatus: EventEmitter<any> = new EventEmitter<any>();
    public signalRConnectionStatus: EventEmitter<any> = new EventEmitter<any>();

    constructor(private signalR: SignalR) { }

    startConnection(access_token) {
        const connectionData: IConnectionOptions = {
            url: environment.signalrUrl,
            hubName: 'signalHub',
            qs: {
                access_token: access_token
            },
            withCredentials: true
        };
        this.connection = this.signalR.createConnection(connectionData);


        this.connection.start()
            .then((c) => {
                console.log(c);
                localStorage.setItem('_SignalRConnection', this.connection.id);
                c.listenFor('mobilePaymentCompleted')
                    .subscribe((data) => {
                        console.log(data);
                        this.smsReceived.emit(data);
                    });
                c.listenFor('creditcardPaymentCompleted')
                    .subscribe((data) => {
                        console.log(data);
                        this.ccPaymentStatus.emit(data);
                    });
                c.status.subscribe((data) => {
                    this.signalRConnectionStatus.emit(data);
                });
                c.errors.subscribe((data) => {
                    localStorage.setItem('serviceError', new Date().toString());
                });

            });
    }



    stopConnection() {
        this.connection.stop();
    }

}


  // @Injectable()
  // export class SignalRService {
  //   private connection: any = $.hubConnection(environment.signalrUrl);
  //   private proxyName: String = 'signalHub';
  //   private proxy: any = this.connection.createHubProxy(this.proxyName);
  //   // create the Event Emitter
  //   public messageReceived: EventEmitter<any> = new EventEmitter<any>();
  //   public connectionEstablished: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  //   public connectionExists: Boolean = false;
  //
  //   constructor() {}
  //
  //   startConnection(access_token): void {
  //     console.log('accesstoken', access_token)
  //     this.connection.qs = {'access_token': access_token}
  //     this.connection.start().done((data: any) => {
  //       console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);
  //       this.connectionEstablished.emit(true);
  //       this.connectionExists = true;
  //       this.registerOnServerEvents();
  //     }).fail((error: any) => {
  //       console.log('Could not connect ' + error);
  //       this.connectionEstablished.emit(false);
  //     });
  //   }
  //
  //   private registerOnServerEvents(): void {
  //     this.proxy.on('newGPDeposit', (data: any) => {
  //       console.log('received in SignalRService: ' + JSON.stringify(data));
  //       this.messageReceived.emit(data);
  //     });
  //   }
  // }


