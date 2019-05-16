/* 
 * Funciones reutilizables en la aplicación
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

/*
 * Valida que exista conexión a Internet
 */
function validarConexionInternet(){
    
}

/*
 * Muestra el indicador de carga
 */
function mostrarLoader($ionicLoading, contenido){
    $ionicLoading.show({
       noBackdrop: false,
       template: contenido
    });
}

/*
 * Muestra una notificación de tipo popup cuando sea solicitada
 */
function mostrarAlerta($ionicPopup, titulo, mensaje, textoBoton, tipoBoton) {
    $ionicPopup.alert({
        title: titulo,
        template: mensaje,
        buttons: [{
                text: textoBoton,
                type: tipoBoton,
                onTap: function (e) {
                    console.log(e);
                }
            }]
    });
}