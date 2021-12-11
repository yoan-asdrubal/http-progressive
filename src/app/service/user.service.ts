import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {UserData} from "./user-model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = 'http://localhost:3000/user';
  batchSize = environment.progressive.syncUser;
  progress = new Subject();
  progress$ = this.progress.asObservable();

  constructor(private http: HttpClient) {
  }

  /**
   *  Implementacion para enviar un array de elementos en lugar de 1 solo
   * @param data
   * @param page
   *
   * syncProgressive(data: UserData[], page = 0) {
   *     const dataToSave = data[this.batchSize * page];
   *     if (data.length > 0)
   *       this.http
   *         .post(this.baseUrl, dataToSave)
   *         .subscribe(() => {
   *           this.progress.next(this.batchSize * (page + 1) * 100 / data.length)
   *           if (this.batchSize * (page + 1) < data.length) {
   *             this.syncProgressive(data, page + 1)
   *           }
   *         })
   *   }
   *
   */
  syncProgressive(data: UserData[], page = 0) {
    const dataToSave = data[this.batchSize * page];
    if (data.length > 0)
      this.http
        .post(this.baseUrl, dataToSave)
        .subscribe(() => {
          this.progress.next(this.batchSize * (page + 1) * 100 / data.length)
          if (this.batchSize * (page + 1) < data.length) {
            this.syncProgressive(data, page + 1)
          }
        })
  }

  getUserData() {
    return this.http
      .get(this.baseUrl)
  }
}
