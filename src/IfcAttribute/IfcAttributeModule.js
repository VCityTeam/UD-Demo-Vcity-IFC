import { Widgets } from 'ud-viz';
import { IfcAttributeWindow } from './IfcAttributeWindow';

export class IfcAttributeModule extends Widgets.Components.ModuleView {
  constructor(cityObjectModule, url = undefined, username = undefined, password = undefined, project_name = undefined) {
    super();
    this.ifcAttributeWindow;
    this.url = url;
    this.username = username;
    this.password = password;
    this.project_name = project_name;
    if(cityObjectModule){
      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_SELECTED', (cityObject) => {
        if(!cityObjectModule.isExtensionUsed('ifc_attribute') && (cityObject.tile.layer.isIfcLayer)){
          this.createExtension(cityObjectModule,cityObject);       
          this.actualCityObject = cityObject;
        }
      });

      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_CHANGED', (cityObject) => {
        if(cityObject.tile.layer.isIfcLayer) {
          if (this.ifcAttributeWindow) {
            this.ifcAttributeWindow.update(cityObject);
            this.actualCityObject = cityObject;
          }
        }
        else this.deleteExtension(cityObjectModule);
      });

      cityObjectModule.addEventListener('EVENT_CITY_OBJECT_UNSELECTED', () => {
        this.deleteExtension(cityObjectModule);
      });
    }
  }

  createExtension(cityObjectModule,cityObject){
    if(cityObject.tile.layer.isIfcLayer) {
      cityObjectModule.addExtension('ifc_attribute',{
        type: 'button',
        html: 'IFC info',
        callback: () => {
          this.ifcAttributeWindow = new IfcAttributeWindow(cityObject,cityObjectModule.view.parentElement, this.url, this.username, this.password, this.project_name);
        }
      });
    }
  }


  deleteExtension(cityObjectModule){
    if(cityObjectModule.isExtensionUsed('ifc_attribute')) {  
      cityObjectModule.removeExtension('ifc_attribute');
      if(this.ifcAttributeWindow){
        this.ifcAttributeWindow.dispose();
        this.ifcAttributeWindow = null;  
      }                      
    }
  }
}