/** @format */

import * as udviz from 'ud-viz';
import {LayerChoiceIfcExtension} from '../src/LayerChoiceExtension';
import { setIfcStyles } from './Utils';

const app = new udviz.Templates.AllWidget();

app.start('../assets/config/config.json').then((config) => {
  app.addBaseMapLayer();

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

  new LayerChoiceIfcExtension(layerChoice);
});
