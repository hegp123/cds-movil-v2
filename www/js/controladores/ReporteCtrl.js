/* 
 * Controlador para el manejo de reporte de pagos
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.reporte', [])

        .controller('ReporteCtrl', function ($scope, $autenticacion, $reporte, $state, $ionicModal, $ionicPopup, $filter, $ionicLoading) {
            $scope.nombreApp = NOMBRE_APP;
            $scope.nombreVista = "Reporte de pagos";

            $scope.fechaBusqueda = {
                fecha: new Date()
            };

            function onSuccess(date) {
                $scope.fechaBusqueda = {
                    fecha: new Date(date)
                };
                document.getElementById("fechaReporte").blur();
                $scope.$apply();
            }

            function onError(error) {
                document.getElementById("fechaReporte").blur();
                console.log("Cancelada la selección de fecha");
            }

            $scope.seleccionarFecha = function () {
                datePicker.show({date: new Date(), mode: 'date'}, onSuccess, onError);
            };

            $scope.$on("$ionicView.beforeEnter", function () {
                var sesion = $autenticacion.obtenerSesion("sesion");

                if (sesion === undefined || sesion === null || sesion.logueado === false) {
                    $state.go('login');
                } else {
                    $scope.datosSesion = {
                        nombreUsuario: sesion.nombreUsuario
                    };

                    $scope.fechaBusqueda = {
                        fecha: new Date()
                    };
                }
            });

            $ionicModal.fromTemplateUrl('templates/reporte/busquedaReporte.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modalReporte = modal;
            });

            var reporte = "";

            $scope.buscarPagos = function () {
                var sesion = $autenticacion.obtenerSesion("sesion");

                mostrarLoader($ionicLoading, "Buscando");

                reporte = "\r\n \r\n \r\n" +
                        "Reporte \r\n" +
                        "Fecha: " + $filter('date')($scope.fechaBusqueda.fecha, "EEEE, d 'de' MMMM 'de' y") + " \r\n";

                // se consulta la base de datos buscando pagos en la fecha indicada
                $reporte.buscarPagos($filter('date')($scope.fechaBusqueda.fecha, 'yyyyMMdd'), sesion.idRecaudador).success(function (respuesta) {
                    var pagos = respuesta;

                    if (pagos.length > 0) {

                        $scope.puntoRecaudo = pagos[0].agencia;

                        reporte += "Punto de Recaudo: " + pagos[0].agencia + " \r\n" +
                                "\r\n" +
                                "ORDENES DE RECIBO CDS \r\n \r\n";

                        $scope.totalPagado = 0;

                        for (var i = 0; i < pagos.length; i++) {
                            if (pagos[i].estado === "0" || pagos[i].estado === "1") {
                                pagos[i].mostrar = true;
                                $scope.totalPagado += Number(pagos[i].valor);
                                reporte += pagos[i].factura + ": $" + $filter('number')(pagos[i].valor) + ",00 \r\n";
                            } else {
                                pagos[i].mostrar = false;
                                reporte += pagos[i].factura + ": ANULADA \r\n";
                            }
                        }

                        $ionicLoading.hide();
                        $scope.pagos = pagos;
                        $scope.modalReporte.show();

                        reporte += "------ \r\n";
                        reporte += "TOTAL: $" + $filter('number')($scope.totalPagado) + ",00 \r\n \r\n \r\n \r\n \r\n \r\n";
                    } else {
                        $ionicLoading.hide();
                        mostrarAlerta($ionicPopup, NOMBRE_APP, "No hay pagos registrados para la fecha " + $filter('date')($scope.fechaBusqueda.fecha, 'dd/MM/yyyy'), "Aceptar", "button-fdlm");
                    }
                }).error(function (data) {
                    $ionicLoading.hide();
                    //URL_WS = "http://172.22.7.1:8080/cdsws/apiv1";
                    //$scope.buscarPagos();
                    mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                });
            };

            $scope.imprimirReporte = function () {
                bluetoothSerial.isEnabled(function () {
                    bluetoothSerial.list(function (devices) {
                        mostrarLoader($ionicLoading, "Imprimiendo");
                        devices.forEach(function (device) {
                            bluetoothSerial.connect(device.address, function () {
                                bluetoothSerial.write(reporte, function () {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Reporte generado con éxito", "Aceptar", "button-fdlm");
                                    bluetoothSerial.disconnect(function () {
                                        console.log("Impresora desconectada");
                                    }, function () {
                                        console.log("No fue posible desconectar la impresora");
                                    });
                                }, function () {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "No se imprimió la factura", "Aceptar", "button-fdlm");
                                });
                            }, function () {
                                $ionicLoading.hide();
                                mostrarAlerta($ionicPopup, NOMBRE_APP, "No es posible conectar con la impresora, verifique la conexión Bluetooth y vuelva a intentarlo", "Aceptar", "button-fdlm");
                            });
                        });
                    });
                }, function () {
                    bluetoothSerial.enable(
                            function () {
                                bluetoothSerial.list(function (devices) {
                                    mostrarLoader($ionicLoading, "Imprimiendo");
                                    devices.forEach(function (device) {
                                        bluetoothSerial.connect(device.address, function () {
                                            bluetoothSerial.write(reporte, function () {
                                                $ionicLoading.hide();
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, "Reporte generado con éxito", "Aceptar", "button-fdlm");
                                                bluetoothSerial.disconnect(function () {
                                                    console.log("Impresora desconectada");
                                                }, function () {
                                                    console.log("No fue posible desconectar la impresora");
                                                });
                                            }, function () {
                                                $ionicLoading.hide();
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, "No se imprimió la factura", "Aceptar", "button-fdlm");
                                            });
                                        }, function () {
                                            $ionicLoading.hide();
                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "No es posible conectar con la impresora, verifique la conexión Bluetooth y vuelva a intentarlo", "Aceptar", "button-fdlm");
                                        });
                                    });
                                });
                            },
                            function () {
                                mostrarAlerta($ionicPopup, NOMBRE_APP, "El bluetooth se encuentra inactivo, actívelo y vuelva a intentar", "Aceptar", "button-fdlm");
                            }
                    );
                });
            };
        });