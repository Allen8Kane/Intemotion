import { Component, OnInit } from '@angular/core';
declare const WCSEvent:any;
declare const Flashphoner: any;
declare const Configuration: any;
@Component({
  selector: 'app-hellofromkz',
  templateUrl: './hellofromkz.component.html',
  styleUrls: ['./hellofromkz.component.css']
})
export class HellofromkzComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    debugger
    const SESSION_STATUS = Flashphoner.constants.SESSION_STATUS;
    const STREAM_STATUS = Flashphoner.constants.STREAM_STATUS;
    const ROOM_EVENT = Flashphoner.roomApi.events;
    const PRELOADER_URL = "./dependencies/media/preloader.mp4"; //todo change path
    let connection;
    

  }

}
