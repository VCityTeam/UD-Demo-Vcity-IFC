## Installing and running this demonstration

The demonstration can be locally (on your desktop) started in the following way
```
npm install
npm run debug      
```
and then use your favorite (web) browser to open
`http://localhost:8000/`.

Note that technically the `npm run debug` command will use the [webpack-dev-server npm package](https://github.com/webpack/webpack-dev-server) that
 - runs node application that in turn launched a vanilla http sever in local (on your desktop) 
 - launches a watcher (surveying changes in sources)
 - in case of change that repacks an updated bundle
 - that triggers a client (hot) reload 


 ## To get semantic data from the IFC file

### 1. BimServer
 - Set up a BimServer using [this docker](https://github.com/VCityTeam/Bimserver-docker)

 - Check-In the ifc_doua.ifc file that you can download [here](https://github.com/VCityTeam/UD-Sample-data/blob/master/Ifc/Chaufferie_doua.ifc) : 
    - Go to the BimView projects page (http://localhost:8888/bimserver/apps/bimviews/?page=Projects if you followed BimServer docker tutorial)
    - Create a new project : 
    ![image](https://user-images.githubusercontent.com/31923744/169301572-38e01c94-2b36-4a28-b47c-7807ff7669b1.png)
    - Fill the project name, and keep it for further use : 
![image](https://user-images.githubusercontent.com/31923744/169301817-b4cd24c7-0315-4702-bb97-e9afb2d5db3f.png)
    - Check-in the ifc_doua.ifc file : 
    ![image](https://user-images.githubusercontent.com/31923744/169301910-8784a33a-17b1-49c5-88ca-95ccbf159d66.png)
![image](https://user-images.githubusercontent.com/31923744/169302022-4daa924d-2863-4f14-ae9c-90dfbac3febe.png)

### 2. Configuration
 - Fill the [config file](./assets/config/config.json) with the following fields :
    - username : the username chosen when setting up the bimserver
    - password : the password chosen when setting up the bimserver
    - url : the url of the bimserver (without the \ at the end, for example http://localhost:8888/bimserver)
    - project : the name of the project used to check-in the ifc file in BimServer
```
"bimserver":{
    "username": USERNAME,
    "password": PASSWORD,
    "url": URL,
    "project": PROJECT_NAME
  }
```

### 3. Get semantic data from the geometry 

- From the LayerChoice widget :
  - focus on the Doua building :
![image](https://user-images.githubusercontent.com/31923744/169303127-5dd32246-ba40-40e6-94ae-f8d361ed59cd.png)
  - hide the Lyon_1 layer : 
  ![image](https://user-images.githubusercontent.com/31923744/169303519-ab9d8758-79b2-4214-8a5a-74388f545f06.png)

- Using the Selection widget :
  - select an object :
  ![image](https://user-images.githubusercontent.com/31923744/169303664-926a5a51-0635-49f7-95ff-2e9fda5efd5c.png)
  - press the Ifc Info button, and the linked semantic should be displayed :
  ![image](https://user-images.githubusercontent.com/31923744/169305239-9db969e4-8a29-4a25-ac1c-9a337ada510d.png)



 

