### Saltshaker_plus Frontend

#### **Install Vue.js > 2.0**
#### **Install Node = 8.11.3 LTS**

````
1. Dependencies

    #npm install
````
````
2. Run

    #npm run dev
````
````
3. Compile

    Modify src/config/Global.vue ServerSrc parameter, set to salt-api url

    Modify build/webpack.prod.config.js The publicPath parameter, where you want to deply the site

    #npm run build
````
````
4. Webserver file

   Modify nginx.conf Set proxy_pass to the saltshaker_api url

   Modify location to point to the dist dir.
````

### Backend saltshaker_api project, please ensure that the version corresponds with the saltshaker_frontend version.
https://github.com/yueyongyue/saltshaker_api

### Orginal creator
### Saltshaker Exchange Learning QQ Group: 622806083
![image](https://github.com/yueyongyue/saltshaker_api/blob/master/screenshots/qq.png)
