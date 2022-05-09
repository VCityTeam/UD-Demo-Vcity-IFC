import { Widgets } from 'ud-viz';
import $ from 'jQuery';

export class IfcAttributeWindow extends Widgets.Components.GUI.Window {
  constructor(cityObject, htmlElement) {
    super('ifcAttribute', 'ifc Attribute', false);

    this.cityObject;

    this.ifcId;

    // this.token = undefined;
    // this.roid = undefined;
    // this.oid = undefined;
    // this.serialiazerOid = undefined;
    // this.downloadToken = undefined;
    // // FIXME: hardwire this somewhere else than down here !
    this.serverUrl = 'http://localhost:8888/bimserver/json';
    this.serverGetUrl = 'http://localhost:8888/bimserver/download';

    // this.jsonObject = undefined;

    this.appendTo(htmlElement);

    this.update(cityObject);
  }

  get innerContentHtml() {
    return /*html*/ `
        <div id="${this.ifcDivID}">
        </div>
        `;
  }

  update(cityObject) {
    if (cityObject) {
      while (this.ifcDivElement.hasChildNodes()) {
        this.ifcDivElement.removeChild(this.ifcDivElement.firstChild);
      }
      this.cityObject = cityObject;
      this.ifcId = this.cityObject.props['id'];
      this.addAttribute('id');
      // this.addAttribute('classe');
      // this.addAttribute('name');
      // this.addPSET();
      this.logInBimServer();
      this.getProjectsByName();
      this.getSerializerByName();
      this.getOidByGuid();
      if (this.oid) {
        this.download();
        this.getDownloadData();

        let div = this.ifcAttributeElement;
        let html = 'Classe : ' + this.jsonObject._t + '<br>';
        html += 'GlobalId : ' + this.jsonObject.GlobalId + '<br>';
        html += 'Name : ' + this.jsonObject.Name + '<br>';
        html += 'Object Type : ' + this.jsonObject.ObjectType + '<br>';
        html += 'Predefined Type : ' + this.jsonObject.PredefinedType + '<br>';
        console.log(this.jsonObject);
        // html += 'Typed by : <ul>';
        // for (let obj in this.jsonObject._rIsTypedBy) {
        //   html +=
        //     '<li>' +
        //     this.jsonObject._rIsTypedBy[obj]._t +
        //     ' ' +
        //     this.jsonObject._rIsTypedBy[obj]._i +
        //     ' </li>';
        // }
        // html += '</ul>Defined by : <ul>';
        // for (var obj in this.jsonObject._rIsDefinedBy) {
        //   console.log(obj);
        //   html +=
        //     '<li>' +
        //     this.jsonObject._rIsDefinedBy[obj]._t +
        //     ' ' +
        //     this.jsonObject._rIsDefinedBy[obj]._i +
        //     ' </li>';
        // }
        // html += '</ul>';
        div.innerHTML = html;
      }
    }
  }

  addAttribute(attributeName) {
    if (this.cityObject.props[attributeName]) {
      let new_div = document.createElement('div');
      new_div.id = attributeName;
      new_div.innerText =
        attributeName + ' : ' + this.cityObject.props[attributeName];
      this.ifcDivElement.appendChild(new_div);
    }
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

  logInBimServer() {
    $.ajax({
      type: 'POST',
      url: this.serverUrl,
      async: false,
      data: `{
                  "request": {
                    "interface": "AuthInterface", 
                    "method": "login", 
                    "parameters": {
                      "username": "admin@admin.fr",
                      "password": "admin"
                    }
                  }
                }`,
      datatype: 'json',
      success: (data) => {
        this.token = data.response.result;
        console.log('logged in');
      },
    });
  }

  getProjectsByName() {
    let json =
      `{
              "token":"` +
      this.token +
      `",
                  "request": {
                      "interface": "ServiceInterface", 
                      "method": "getProjectsByName", 
                      "parameters": {
                          "name": "doua"
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
        console.log(this.roid);
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
        console.log(this.serialiazerOid);
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
        console.log(this.cityObject);
        this.oid = data.response.result;
        console.log(this.oid);
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

    // getProgress(){
    //   let json = `{
    //           "token":"` + this.token + `",
    //           "request": {
    //               "interface": "NotificationRegistryInterface",
    //               "method": "getProgress",
    //               "parameters": {
    //                 "topicId": ` + this.downloadToken + `
    //               }
    //             }
    //       }
    //         `;
    //   $.ajax({
    //     type: 'POST',
    //     url: this.serverUrl,
    //     async: false,
    //     data: json,
    //     datatype: 'json',
    //     success: (data) => {
    //       console.log(data);
    //     }
    //   });
    // }

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
          console.log(data);
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
