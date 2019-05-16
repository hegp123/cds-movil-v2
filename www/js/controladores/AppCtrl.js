/* 
 * Controlador para las funciones generales de la aplicación
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.app', [])

        .controller('AppCtrl', function ($scope, $autenticacion, $state, $ionicActionSheet, $ionicPopup, $ionicModal, $ionicLoading, $ionicPopover) {
            $scope.nombreApp = NOMBRE_APP;
            $scope.estadoLogin = false;
            $scope.fecha = new Date();

            var sesion = $autenticacion.obtenerSesion("sesion");

            if (sesion !== undefined && sesion !== null && sesion.logueado !== false) {
                if (sesion.logueado === true) {
                    $scope.estadoLogin = true;
                }
            }

            $ionicModal.fromTemplateUrl('templates/cambiarContrasenha.html', {
                scope: $scope
            }).then(function (modal) {
                $scope.modalCambiarContrasenha = modal;
            });

            $scope.clave = {
                idRecaudador: '',
                claveActual: '',
                nuevaClave: '',
                confirmarClave: ''
            };

            $scope.cambiarClave = function (modalCambiarContrasenha) {
                var sesion = $autenticacion.obtenerSesion("sesion");
                mostrarLoader($ionicLoading, "Cambiando contraseña");
                $scope.clave.idRecaudador = sesion.idRecaudador;
                var login = sesion.loginUsuario;

                $autenticacion.cambiarClave($scope.clave.claveActual, $scope.clave.nuevaClave, $scope.clave.confirmarClave, $scope.clave.idRecaudador, login).success(function (respuesta) {
                    modalCambiarContrasenha.hide();

                    $scope.clave = {
                        idRecaudador: '',
                        claveActual: '',
                        nuevaClave: '',
                        confirmarClave: ''
                    };

                    if (respuesta) {
                        $ionicLoading.hide();
                        mostrarAlerta($ionicPopup, NOMBRE_APP, "La contraseña se cambió correctamente", "Aceptar", "button-fdlm");
                    } else {
                        $ionicLoading.hide();
                        mostrarAlerta($ionicPopup, NOMBRE_APP, "La contraseña no se ha cambiado, verifique que la contraseña actual sea correcta.  La nueva contraseña debe ser diferente a las últimas cinco asignadas.", "Aceptar", "button-fdlm");
                    }
                }).error(function (data) {
                    $ionicLoading.hide();
                    mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                });
            };

            $scope.mostrarOpciones = function () {
                var sesion = $autenticacion.obtenerSesion("sesion");

                $ionicActionSheet.show({
                    titleText: '<p class="letra-usuario">' + sesion.nombreUsuario + '</p>',
                    buttons: [
                        {
                            text: '<i class="icon ion-lock-combination fdlm"></i> <b>Cambiar contraseña</b>'
                        },
                        {
                            text: '<i class="icon ion-printer fdlm"></i> <b>Probar impresora</b>'
                        },
                        {
                            text: '<i class="icon ion-power assertive"></i> <b>Cerrar Sesión</b>'
                        }
                    ],
                    //titleText: 'Opciones',
                    cancel: function () {
                        //código para cancelar
                    },
                    buttonClicked: function (index) {
                        if (index === 0) {
                            $scope.modalCambiarContrasenha.show();
                        }

                        if (index === 1) {
                            bluetoothSerial.isEnabled(function () {
                                bluetoothSerial.list(function (devices) {
                                    mostrarLoader($ionicLoading, "Imprimiendo");
                                    devices.forEach(function (device) {
                                        var factura = "\r\n \r\n \r\n" +
                                                "Prueba de impresión exitosa \r\n \r\n \r\n";

                                        bluetoothSerial.connect(device.address, function () {
                                            bluetoothSerial.write(factura, function () {
                                                $ionicLoading.hide();
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, "Impresora conectada con éxito", "Aceptar", "button-fdlm");
                                                bluetoothSerial.disconnect(function () {
                                                    console.log("Impresora desconectada");
                                                }, function () {
                                                    console.log("No fue posible desconectar la impresora");
                                                });
                                            }, function () {
                                                $ionicLoading.hide();
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, "No se pudo imprimir", "Aceptar", "button-fdlm");
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
                                                    var factura = "\r\n \r\n \r\n" +
                                                            "Prueba de impresión exitosa \r\n \r\n \r\n";

                                                    bluetoothSerial.connect(device.address, function () {
                                                        bluetoothSerial.write(factura, function () {
                                                            $ionicLoading.hide();
                                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "Impresora conectada con éxito", "Aceptar", "button-fdlm");
                                                            bluetoothSerial.disconnect(function () {
                                                                console.log("Impresora desconectada");
                                                            }, function () {
                                                                console.log("No fue posible desconectar la impresora");
                                                            });
                                                        }, function () {
                                                            $ionicLoading.hide();
                                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "No se pudo imprimir", "Aceptar", "button-fdlm");
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
                        }

                        if (index === 2) {
                            $autenticacion.asignarSesion("sesion", null);
                            $state.go('login');
                        }
                        return true;
                    }
                });
            };
        });


