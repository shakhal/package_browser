import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TreeModule } from 'ng2-tree';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { DependenciesComponent } from './dependencies/dependencies.component';
import { DependenciesService } from './dependencies/dependencies.service';

@NgModule({
  declarations: [
    AppComponent,
    DependenciesComponent
  ],
  imports: [
    BrowserModule, TreeModule, HttpModule
  ],
  providers: [DependenciesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
