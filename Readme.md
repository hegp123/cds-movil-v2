# CDS Móvil   debemos generar el API 28, para no tener problemas en la tienda con google

## REQUISITOS 
versiones del equipo de chajin
node    		6.9.5
npm				3.10.10
ionic CLI 		2.2.1
ionic App Lib 	2.2.0
cordova			6.5.0

Version mi equipo mayasoft
node    		10.8.0
npm				6.4.1
ionic CLI 		2.2.1
ionic App Lib 	2.2.0
cordova			6.5.0
Instalar java   8 ultima (1.8.0.211)
Instalar Ant    ultima version (1.10.6)
Instalar SDK Android ultima (24-4-1)
Instalar dentro del SDK instalado anteriormente lo abrimos y luego instalamos lo siguiente:
    instalar Android SDK platform-tools
    instalar Android SDK Build-tools 25 (actual) y 28 (meta)
    instalar SDK platform  API-25 (actual) y API-28 (meta)

establecer las variables de entorno:
- java8:        C:\Program Files\Java\jdk1.8.0_74\bin
- sdk-android:  C:\Program Files (x86)\Android\android-sdk\tools
                C:\Program Files (x86)\Android\android-sdk\tools\bin
                C:\Program Files (x86)\Android\android-sdk\platform-tools
- ant:          C:\ant-1.10.6\bin

----------------------------------------------
npm install -g ionic@2.2.1
npm install -g cordova@6.5.0


## despues de descargar los fuentes de un repositorio, este viene sin las tres carpetas llamadas (node_modules, platforms y pluging)

## Instalar todas las dependencias, esto deberia construir el folder node_modules
1. npm install

## convertir la aplicacion en android, construye el folder platforms, primero la borramos y la volvemos a crear
2.  cordova platform rm android
    cordova platform add android

IMPORTANTE: despues de correr el antirior comando "add" debemos elegir la version de la API de android en la cual se va a generar el App.
- Abrimos el archivo platforms\android\project.properties
- en target  le damos el valor de la API que queremos 25 (actual)  y 28  (meta)

## hacer el build, esto deberia construir los folderes platforms y plugins
3. ionic build android

## para desplegar la aplicacion en el celular
## requisitos:
## En el pc debe estar instalado los driver del celular que se quiera instalar directamente para pruebas
## el cel debe estar conectado al pc
4. ionic run android

## Eliminar plugin, para que sean generados nuevamente con el apk que se desea subir a produccion
## Esto estaba en el manual que hizo roberto.chajin
5. cordova plugin rm cordova-plugin-console

## Generamos el apk listo para ser firmado
## Esto estaba en el manual que hizo roberto.chajin
6. cordova build --release android --  --versionCode=201008

## firmamos el apk
## requisitos:  archico key.store y la clave con el cual se geberó este archivo
## estos dos no se pueden perder ni olvidar, porque es para poder subir las aplicaciones a la tienda desde la cuenta de la FDLM 
## importante las rutas: D:\hectorgarcia\produccion\    son donde este los archivos fisicamente
## desde una consola como administrador:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore "M:\FDLM\produccion\fdlm.keystore" "M:/FDLM/software/cds-movil-v2/platforms/android/build/outputs/apk/android-release-unsigned.apk" llave_android_fdlm

## ahora lo comprimimos, para prepararlo para subir a la tienda 
## desde una consola como administrador:
# C:\Program Files (x86)\Android\android-sdk  es la ruta de instalacion del sdk de android
# "M:/FDLM/software/cds-movil-v2/platforms/android/build/outputs/apk/ es la ruta donde esta quedando el apk firmado
# M:\FDLM\produccion\ es la ruta donde quiero que quede nuestro archivo apk listo para subir a la tienda
"C:\Program Files (x86)\Android\android-sdk\build-tools\25.0.0\zipalign" -v 4 "M:/FDLM/software/cds-movil-v2/platforms/android/build/outputs/apk/android-release-unsigned.apk" "M:\FDLM\produccion\CDS_FDLM.apk"
