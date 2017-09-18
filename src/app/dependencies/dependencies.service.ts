import { Injectable } from '@angular/core';
import { DependenciesComponent } from './dependencies.component';
import { Http, Response } from '@angular/http';

@Injectable()
export class DependenciesService {
  constructor(
    private http: Http
  ){}

  getDependencies(name, version) {
    return this.http.get('http://localhost:3000/api/depend?name='+name+'&version='+version)
      .map((res:Response) => res.json());
  }
}
