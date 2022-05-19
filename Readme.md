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

 - Set up a BimServer using [this docker](https://github.com/VCityTeam/Bimserver-docker)

 - Check-In the ifc_doua.ifc file [here](https://github.com/VCityTeam/UD-Sample-data/blob/master/Ifc/Chaufferie_doua.ifc)  
    - 
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
 

