import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkin-success',
  templateUrl: './checkin-success.component.html',
  styleUrls: ['./checkin-success.component.css']
})
export class CheckinSuccessComponent implements OnInit {
  date: any;
  constructor() { }

  ngOnInit() {
    this.date = new Date;
    console.log(this.date.getTime());
  }

}
