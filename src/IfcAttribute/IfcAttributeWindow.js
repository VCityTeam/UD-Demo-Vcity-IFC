import { Widgets } from 'ud-viz';
import $ from 'jQuery';

export class IfcAttributeWindow extends Widgets.Components.GUI.Window {
  constructor(cityObject, htmlElement, url = undefined, username = undefined, password = undefined, project_name = undefined) {
    super('ifcAttribute', 'ifc Attribute', false);

    this.cityObject;

    this.ifcId;

    this.token = undefined;
    this.roid = undefined;
    this.oid = undefined;
    this.serialiazerOid = undefined;
    this.downloadToken = undefined;
    this.jsonObject = undefined;

    // // FIXME: hardwire this somewhere else than down here !
    this.serverUrl = url+'/json';
    this.serverGetUrl = url+'/download';
    this.appendTo(htmlElement);
    this.logInBimServer(username,password);
    this.getProjectsByName(project_name);
    if(this.token && this.roid){
      this.getSerializerByName();
      this.update(cityObject);
    }
    else {
      this.addAttribute("Connection error","Check configuration of BimServer in configuration file");
    }

  }

  get innerContentHtml() {
    return /*html*/ `
        <div id="${this.ifcDivID}">
        </div>
        `;
  }

  update(cityObject) {
    if(this.token){
      if (cityObject) {
        while (this.ifcDivElement.hasChildNodes()) {
          this.ifcDivElement.removeChild(this.ifcDivElement.firstChild);
        }
        this.cityObject = cityObject;
        this.ifcId = this.cityObject.props['id'];
        this.addBatchTableAttribute('id');
        this.getOidByGuid();
        if (this.oid) {
          this.download();
          this.getDownloadData();
          this.addAttribute('Classe',this.jsonObject._t);
          this.addAttribute('Global Id',this.jsonObject.GlobalId);
          this.addAttribute('Name',this.jsonObject.Name);
          this.addAttribute('Object Type',this.jsonObject.ObjectType);
        }
      }
    }
  }

  addBatchTableAttribute(attributeName) {
    if (this.cityObject.props[attributeName]) 
      this.addAttribute(attributeName,this.cityObject.props[attributeName]);
  }

  addAttribute(attributeName,attributeValue) {
    let new_div = document.createElement('div');
    new_div.id = attributeName;
    new_div.innerText =
      attributeName + ' : ' + attributeValue;
    this.ifcDivElement.appendChild(new_div);
  }

  addPSET() {
    if (this.cityObject.props['properties']) {
      for (let prop of this.cityObject.props['properties']) {
        let new_div = document.createElement('div');
        new_div.innerText = prop[0];
        let list = document.createElement('ul');
        for (var i = 1; i < prop.length; i++) {
          let el = document.createElement('li');
          el.innerText = prop[i][0] + ' : ' + prop[i][1].toString();
          list.appendChild(el);
        }
        new_div.appendChild(list);
        this.ifcDivElement.appendChild(new_div);
      }
    }
  }

  windowCreated() {}

  logInBimServer(username,password) {
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: `{
                  "request": {
                    "interface": "AuthInterface", 
                    "method": "login", 
                    "parameters": {
                      "username": "${username}",
                      "password": "${password}"
                    }
                  }
                }`,
      datatype: 'json',
      success: (data) => {
        this.token = data.response.result;
        console.log('logged in');
      }
    });
  }

  getProjectsByName(project_name) {
    let json =
      `{
              "token":"` +
      this.token +
      `",
                  "request": {
                      "interface": "ServiceInterface", 
                      "method": "getProjectsByName", 
                      "parameters": {
                          "name": "${project_name}"
                      }
                  }
              }
            `;
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: json,
      datatype: 'json',
      success: (data) => {
        this.roid = data.response.result[0].lastRevisionId;
      },
    });
  }

  getSerializerByName() {
    let json =
      `{
              "token":"` +
      this.token +
      `",
                  "request": {
                      "interface": "ServiceInterface", 
                      "method": "getSerializerByName", 
                      "parameters": {
                        "serializerName": "Json (Streaming)"
                      }
                  }
              }
            `;
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: json,
      datatype: 'json',
      success: (data) => {
        this.serialiazerOid = data.response.result.oid;
      },
    });
  }

  getOidByGuid() {
    let json =
      `{
              "token":"` +
      this.token +
      `",
              "request": {
                  "interface": "ServiceInterface", 
                  "method": "getOidByGuid", 
                  "parameters": {
                    "roid": ` +
      this.roid +
      `,
                    "guid": "` +
      this.ifcId +
      `"
                  }
                }
              }
            `;
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: json,
      datatype: 'json',
      success: (data) => {
        this.oid = data.response.result;
      },
    });
  }

  download(){
    let json = `{
            "token":"` + this.token + `",
            "request": {
                "interface": "ServiceInterface",
                "method": "download",
                "parameters": {
                  "roids": ["` + this.roid + `"],
                  "query": "{\\"oids\\":[` + this.oid + `]}",
                  "serializerOid": `+ this.serialiazerOid + `,
                  "sync": "false"
                }
            }
        }
          `;
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: json,
      datatype: 'json',
      success: (data) => {
        this.downloadToken = data.response.result;
      }
    });
  }

  getDownloadData() {
    let json = 'topicId=' + this.downloadToken + '&token=' + this.token;
    $.ajax({
      type: 'GET',
      url: this.serverGetUrl,
      async: false,
      data : json,
      datatype: 'json',
      success: (data) => {
        this.jsonObject = data.objects[0];
      }
    });
  }

  get ifcAttributeID() {
    return 'ifc_attribute';
  }

  get ifcAttributeElement() {
    return document.getElementById(this.ifcAttributeID);
  }

  get ifcDivID() {
    return 'ifc_attribute_div';
  }

  get ifcDivElement() {
    return document.getElementById(this.ifcDivID);
  }
}
