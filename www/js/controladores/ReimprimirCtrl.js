/* 
 * Controlador para el manejo de pagos
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.reimprimir', [])

        .controller('ReimprimirCtrl', function ($scope, $autenticacion, $ionicLoading, $state, $facturas, $ionicPopup, $ionicModal) {
            $scope.nombreApp = NOMBRE_APP;
            $scope.nombreVista = "Reimprimir Orden de Recibo";

            $scope.cadenaBusqueda = {
                factura: ''
            };

            $scope.$on("$ionicView.beforeEnter", function () {
                var sesion = $autenticacion.obtenerSesion("sesion");

                if (sesion === undefined || sesion === null || sesion.logueado === false) {
                    $state.go('login');
                } else {
                    $scope.datosSesion = {
                        nombreUsuario: sesion.nombreUsuario
                    };
                }
            });

            // se instancian las vistas modales que se mostraran en la busqueda y pago del crédito
            $ionicModal.fromTemplateUrl('templates/reimprimir/listado_reimprimir.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modalListadoReimprimir = modal;
            });

            $scope.buscarFactura = function () {
                mostrarLoader($ionicLoading, "Buscando");
                var sesion = $autenticacion.obtenerSesion("sesion");

                $facturas.buscarFactura($scope.cadenaBusqueda.factura, sesion.idPunto, sesion.idRecaudador).success(function (respuesta) {
                    var factura = respuesta;

                    if (factura.length > 0 && factura[0].numeroFactura !== null) {
                        $scope.facturas = respuesta;
                        $ionicLoading.hide();
                        $scope.modalListadoReimprimir.show();
                    } else {
                        $ionicLoading.hide();
                        mostrarAlerta($ionicPopup, NOMBRE_APP, "No existe el número de Orden de Recibo ingresado, o el pago se realizó en otro punto de recaudo", "Aceptar", "button-fdlm");
                    }

                    $scope.cadenaBusqueda = {
                        factura: ''
                    };
                }).error(function (data) {
                    $ionicLoading.hide();
                    //URL_WS = "http://172.22.7.1:8080/cdsws/apiv1";
                    //$scope.buscarFactura(); 
                    mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                });
            };

            $scope.reimprimirFactura = function (factura) {
                $scope.modalListadoReimprimir.hide();
                $state.go('factura', {credito: JSON.stringify(factura), vista: 'reimpresion'});
            };
        });