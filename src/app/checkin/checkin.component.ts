import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PlacesService } from "../_services/places.service"
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  form: FormGroup;
  files = [];
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>;

  constructor(public placesService: PlacesService, private storage: AngularFireStorage, private db: AngularFirestore) { }

  ngOnInit() {
    let mobile_pattern = "^\d*[0-9]\d*$";// /[0-9\+\-\ ]/;
    this.form = new FormGroup({
      name: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      address: new FormControl("", [Validators.required, Validators.maxLength(30)]),
      email: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
      phone: new FormControl("", [Validators.required]),// Validators.pattern(mobile_pattern)]
      booking_id: new FormControl("", [Validators.required, Validators.maxLength(5)]),
      files: new FormControl("", [Validators.required]),

    });
  }

  submit(form) {
    console.log(form);
    this.placesService.checkinCustomer(form);
  }
  csvInputChange(fileInputEvent: any) {
    console.log(fileInputEvent.target.files[0]);
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.files.push(event.target.result);
        }
        console.log(event.target.files);
        // console.log(this.urls)

        let url = reader.readAsDataURL(event.target.files[i]);
        console.log(url)
      }
    }
  }

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.storage.ref(id);
    this.task = this.ref.put(event.target.files[0]);

    this.task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = this.ref.getDownloadURL()))
      .subscribe();

  }

}
