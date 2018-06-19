import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, catchError } from 'rxjs/operators';
//import * as socketIo from 'socket.io-client';
import {$WebSocket} from 'angular2-websocket/angular2-websocket'


import { Socket } from '../shared/interfaces';

declare var io : {
  connect(url: string): Socket;
};

@Injectable()
export class DataService {

  socket: Socket;
  observer: Observer<string>;

  getQuotes() : Observable<string> {

//    this.socket = socketIo('http://localhost:8081');

    var ws = new $WebSocket("ws://localhost:8080");
    ws.send4Direct("by default, this will be sent, because Observer is hot.\0");

    ws.onMessage(
       (msg: MessageEvent)=> {
	 this.observer.next(msg.data);
    //       console.log("onMessage ", msg.data);
       },
       {autoApply: false}
    );

    //this.socket.on('data', (res) => {
    //  this.observer.next(res.data);
    //});

    return this.createObservable();
  }

  createObservable() : Observable<string> {
      return new Observable<string>(observer => {
        this.observer = observer;
      });
  }

  private handleError(error) {
    console.error('server error:', error);
    if (error.error instanceof Error) {
        let errMessage = error.error.message;
        return Observable.throw(errMessage);
    }
    return Observable.throw(error || 'Socket.io server error');
  }

}
