import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { TreeModel } from 'ng2-tree';
import { DependenciesService } from "./dependencies.service";


@Component({
  selector: 'app-dependencies',
  templateUrl: './dependencies.component.html',
  styleUrls: ['../../../node_modules/ng2-tree/styles.css',  './dependencies.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DependenciesComponent implements OnInit {

  constructor(
    private dependenciesService: DependenciesService
  ) { }

  public fonts: TreeModel;

  show(name, version) {
    var self = this;


    var getChildren = function getChildren(name, version, callback){
      var s = self.dependenciesService.getDependencies(name, version)
        .subscribe(data => {
            var deps;
            if (data.map){
              deps = data.map(function(el){
                var name = Object.keys(el)[0];
                var version = el[Object.keys(el)[0]];
                return {
                  value: name + "@" + version,
                  loadChildren: getChildren.bind(this, name, version)
                }
              })
            }
            else { //some angular glitch
              deps = [];
              for (var i in Object.keys(data)){
                var it = Object.keys(data)[i];
                var name = it;
                var version = data[it];
                deps.push(
                  {
                    value: name + "@" + version,
                    loadChildren: getChildren.bind(this, name, version)
                  }
                );
              }
            }
            callback(deps);
          }
        );
    }

    self.dependenciesService.getDependencies(name, version)
      .subscribe(data => {
        this.fonts = {
          value: name + "@" + version,
          loadChildren: getChildren.bind(this, name,version)
        };
      }, error => {
        this.fonts = {
          value: "Not found"
        };
      });


  }

  ngOnInit() {
  }
}


