/* 
 * Controlador para la vista de inicio de sesión
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.login', [])

    .controller('LoginCtrl', function ($scope, $autenticacion, $ionicPopup, $state, $ionicLoading, $timeout, $ionicModal, Base64) {
        $scope.nombreApp = NOMBRE_APP;
        $scope.nombreVista = "Inicio de sesión";
        var intentos_login = 0;
        $scope.appVersion = "1.8";

        //AuthenticationService.ClearCredentials();

        $scope.$on("$ionicView.beforeEnter", function () {
                cordova.getAppVersion.getVersionNumber().then(function (version){
                    console.log(version);
                    $scope.appVersion = version;
                });

            var sesion = $autenticacion.obtenerSesion("sesion");

            if (sesion !== undefined && sesion !== null && sesion.logueado !== null) {
                if (sesion.logueado === true) {
                    $scope.datosSesion = {
                        nombreUsuario: sesion.nombreUsuario
                    };
                    $state.go('tab.pagos');
                }
            }
        });

        $ionicModal.fromTemplateUrl('templates/cambiarContrasenha.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalCambiarContrasenha = modal;
        });

        $scope.usuario = {
            nombreUsuario: '',
            clave: ''
        };

        //            $scope.login = function () {
        //                AuthenticationService.Login($scope.usuario.nombreUsuario, $scope.usuario.clave, function (response) {
        //                    if (response.success) {
        //                        AuthenticationService.SetCredentials($scope.usuario.nombreUsuario, $scope.usuario.clave);
        //                        $state.go('tab.pagos');
        //                    } else {
        //                        $scope.error = response.message;
        //                    }
        //                });
        //            };

        $scope.iniciarSesion = function () {
            if ($scope.usuario.clave.length > 5) {
                document.getElementById("btnLogin").disabled = true;
                mostrarLoader($ionicLoading, "Iniciando sesión");

                $autenticacion.validarAPI().success(function (response, status, headers, config) {
                    console.log($scope.appVersion);
                    if (response.estado && response.appVersion == $scope.appVersion) {

                        var nombreUsuario = $scope.usuario.nombreUsuario;
                        var clave = Base64.encode($scope.usuario.clave);

                        if (nombreUsuario !== '' && clave !== '') {

                            var usuario = {
                                loginUsuario: nombreUsuario,
                                claveUsuario: clave
                            };

                            $autenticacion.login(usuario).success(function (respuesta, status, headers, config) {
                                if (intentos_login < 5) {
                                    if (respuesta.logueado) {
                                        //intentos_login = 0;

                                        if (respuesta.puntoBloqueado !== 0) {
                                            $ionicLoading.hide();
                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "Su punto de recaudo se encuentra bloqueado por Conciliación (consignación). Tan pronto se valide su pago será habilitado.", "Aceptar", "button-fdlm");
                                            $autenticacion.logout();
                                        } else if (respuesta.puntoCerrado !== 0) {
                                            $ionicLoading.hide();
                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "Su punto de recaudo se encuentra cerrado.", "Aceptar", "button-fdlm");
                                            $autenticacion.logout();
                                        } else if (respuesta.estadoSucursalPrincipal !== "A") {
                                            $ionicLoading.hide();
                                            mostrarAlerta($ionicPopup, NOMBRE_APP, "La sucursal principal se encuentra cerrada, por favor intente de nuevo más tarde.", "Aceptar", "button-fdlm");
                                            $autenticacion.logout();
                                        } else {
                                            $scope.usuario = {
                                                nombreUsuario: '',
                                                clave: ''
                                            };

                                            var d1 = moment(new Date());
                                            var d2 = moment(respuesta.fechaCambioClave, 'YYYYMMDD');
                                            var diasCambio = moment.duration(d1.diff(d2)).asDays();

                                            if (respuesta.mensajePantalla !== null && respuesta.mensajePantalla !== "") {
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, respuesta.mensajePantalla, "Aceptar", "button-fdlm");
                                            }

                                            if (respuesta.mensajeResolucion !== "") {
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, respuesta.mensajeResolucion, "Aceptar", "button-fdlm");
                                            }

                                            if (respuesta.forzarCambioClave === 1 || diasCambio >= 60) {
                                                $autenticacion.asignarSesion("sesion", respuesta);
                                                $ionicLoading.hide();
                                                $scope.modalCambiarContrasenha.show();
                                            } else {
                                                $ionicLoading.hide();
                                                $autenticacion.asignarSesion("sesion", respuesta);
                                                $state.go('tab.pagos');
                                            }
                                        }
                                    } else {
                                        intentos_login += 1;
                                        $ionicLoading.hide();
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "El nombre de usuario o la contraseña son incorrectos", "Aceptar", "button-fdlm");
                                        document.getElementById("btnLogin").disabled = false;
                                    }
                                } else {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Máximo número de intentos de inicio de sesión superado, favor ingresar a la aplicación e intente de nuevo.", "Aceptar", "button-fdlm");
                                }
                            }).error(function (data, status, headers, config) {
                                $ionicLoading.hide();
                                mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                            });
                        } else {
                            $ionicLoading.hide();
                            mostrarAlerta($ionicPopup, NOMBRE_APP, "Por favor, ingrese el nombre de usuario y la contraseña para acceder", "Aceptar", "button-fdlm");
                        }
                    } else {
                        $ionicLoading.hide();
                        mostrarAlerta($ionicPopup, NOMBRE_APP, "Hay una nueva versión disponible, por favor actualice la aplicación.", "Aceptar", "button-fdlm");
                        document.getElementById("btnLogin").disabled = false;
                    }
                }).error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                });
            } else {
                mostrarAlerta($ionicPopup, NOMBRE_APP, "La contraseña es muy corta, verifíquela e intente nuevamente.", "Aceptar", "button-fdlm");
            }
        };

        $scope.$on('modal.hidden', function () {
            $autenticacion.asignarSesion("sesion", null);
        });
    });


