/** @format */

import * as udviz from 'ud-viz';
import {LayerChoiceIfcExtension} from '../src/LayerChoiceExtension';
import { IfcAttributeModule } from './IfcAttribute/IfcAttributeModule';
import { setIfcStyles } from './Utils';

const app = new udviz.Templates.AllWidget();

app.start('../assets/config/config.json').then((config) => {
  app.addBaseMapLayer();
  app.addElevationLayer();
  app.setupAndAdd3DTilesLayers();

  
  for (let layer of config['3DTilesLayers']) {
    if (layer['ifc']) {
      setIfcStyles(app.layerManager, layer['id']);
    }
  }
  
  ////// ABOUT MODULE
  const about = new udviz.Widgets.AboutWindow();
  app.addModuleView('about', about);

  ////// 3DTILES DEBUG
  const debug3dTilesWindow = new udviz.Widgets.Extensions.Debug3DTilesWindow(
    app.layerManager
  );
  app.addModuleView('3dtilesDebug', debug3dTilesWindow, {
    name: '3DTiles Debug',
  });

  ////// LAYER CHOICE MODULE
  const layerChoice = new udviz.Widgets.LayerChoice(app.layerManager);
  app.addModuleView('layerChoice', layerChoice);


  ////// CITY OBJECTS MODULE
  let cityObjectModule = new udviz.Widgets.CityObjectModule(
    app.layerManager,
    app.config
  );
  app.addModuleView('selection', cityObjectModule.view);
  new LayerChoiceIfcExtension(layerChoice);
  if(config['bimserver']){
    new IfcAttributeModule(cityObjectModule,config['bimserver']['url'],config['bimserver'].username,config['bimserver'].password,config['bimserver'].project_name); 
  }

});
