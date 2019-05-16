/* 
 * Controlador para el manejo de pagos
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.pagos', [])

    .controller('PagosCtrl', function ($scope, $autenticacion, $state, $ionicModal, $ionicPopup, $ionicLoading, $filter, $creditos, $rootScope) {
        $scope.nombreApp = NOMBRE_APP;
        $scope.nombreVista = "Registrar Pago";
        $scope.cadenaBusqueda = {
            busqueda: ''
        };
        $scope.creditos = {};
        $scope.valorPagar = 0;

        // se declaran los tipos de busqueda a los que podrá acceder el usuario
        $scope.tipoBusqueda = [
            {
                nombre: 'C.C',
                placeholder: 'Escriba aquí el No. de cédula',
                tipo: 'number'
            }, {
                nombre: 'Crédito',
                placeholder: 'Escriba aquí el No. del crédito',
                tipo: 'number'
            }
        ];

        $scope.tipoSeleccionado = $scope.tipoBusqueda[0];

        // Valida que exista la sesión de usuario
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
        $ionicModal.fromTemplateUrl('templates/pagos/busquedaPagos.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $ionicModal.fromTemplateUrl('templates/pagos/pagarCredito.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modalPago = modal;
        });

        $scope.cambiarTipoBusqueda = function (tipo) {
            $scope.tipoSeleccionado = tipo;
        };

        $scope.iniciarBusqueda = function () {
            if ($scope.cadenaBusqueda.busqueda !== '') {
                mostrarLoader($ionicLoading, "Buscando");
                $autenticacion.validarAPI().success(function (response, status, headers, config) {
                    if (response.estado) {
                        var mensaje = '';
                        var sesion = $autenticacion.obtenerSesion("sesion");

                        switch ($scope.tipoSeleccionado) {
                            case $scope.tipoBusqueda[0]:
                                $creditos.buscarPorCC($scope.cadenaBusqueda.busqueda, sesion.idPunto).then(function (respuesta) {
                                    $scope.creditos = respuesta.data;

                                    mensaje = "No hay créditos asociados al No. de identificación ingresado";

                                    if ($scope.creditos.length > 0) {
                                        $ionicLoading.hide();
                                        $scope.modal.show();
                                    } else {
                                        $ionicLoading.hide();
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, mensaje, "Aceptar", "button-fdlm");
                                    }
                                }, function (error) {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                                });

                                break;
                            case $scope.tipoBusqueda[1]:
                                $creditos.buscarPorCredito($scope.cadenaBusqueda.busqueda, sesion.idPunto).then(function (respuesta) {
                                    $scope.creditos = respuesta.data;

                                    mensaje = "No hay créditos asociados al No. de crédito ingresado";

                                    if ($scope.creditos.length > 0 && $scope.creditos[0].codigoCredito !== null) {
                                        $ionicLoading.hide();
                                        $scope.modal.show();
                                    } else {
                                        $ionicLoading.hide();
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, mensaje, "Aceptar", "button-fdlm");
                                    }
                                }, function (error) {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                                });

                                break;
                        }
                    }
                }).error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    //URL_WS = "http://172.22.7.1:8080/cdsws/apiv1";
                    //$scope.iniciarBusqueda();
                    mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                });
            }
        };

        $scope.cerrarBusqueda = function () {
            $scope.cadenaBusqueda.busqueda = '';
            $scope.modal.hide();
        };

        $scope.cerrarPago = function () {
            $scope.modalPago.hide();
        };

        $scope.prepararPago = function (credito) {

            if (credito.valorBloqueado) {
                $scope.parametrizado = true;
            } else {
                $scope.parametrizado = false;
            }

            $creditos.buscarPorSeleccion(credito.codigoCredito, credito.cuotaCredito, credito.id, credito.tacCDS, credito.porVencer).then(function (respuesta) {
                $scope.credito = respuesta.data;
                $scope.modalPago.show();

                $creditos.infoPagosCredito(credito.codigoCredito).then(function (respuesta) {
                    if (respuesta.data.mensaje !== null && respuesta.data.valor !== null) {
                        mostrarAlerta($ionicPopup, NOMBRE_APP, respuesta.data.mensaje + $filter('currency')(respuesta.data.valor), "Aceptar", "button-fdlm");
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                });
            });
        };

        $scope.realizarPago = function (credito, valorPagar) {
            var valorSinPunto = parseInt(valorPagar);
            var valor = valorSinPunto.toString();
            var popupConfirmacion = null;
            var inicioCuota = moment(credito.fechaInicioCuota);
            var vencimiento = moment(credito.vencimiento);
            var fechaProceso = moment(credito.fechaProceso);            

            if (valorPagar === 0) {
                $ionicPopup.alert({
                    title: 'Realizar pago de cuota',
                    template: 'Debe registrar un valor igual o mayor a ' + $filter('currency')(valor),
                    okText: 'Aceptar',
                    okType: 'button-fdlm'
                });
            } else if (fechaProceso < inicioCuota || credito.porVencer) {
                popupConfirmacion = $ionicPopup.confirm({
                    title: 'Realizar pago de cuota',
                    template: 'Está realizando abono a captal.',
                    cancelText: 'Cancelar',
                    canceltype: 'button-cancelar',
                    okText: 'Aceptar',
                    okType: 'button-fdlm'
                });
                popupConfirmacion.then(function (res) {
                    if (res) {
                        var sesion = $autenticacion.obtenerSesion("sesion");
                        mostrarLoader($ionicLoading, "Pagando");

                        var pago = {
                            cuenta: credito.codigoCredito,
                            cuota: credito.cuotaCredito,
                            operacion: credito.operacion,
                            sucursal: credito.sucursalCliente,
                            producto: credito.idproducto,
                            tac: credito.tacCDS,
                            valor: valor,
                            idRecaudador: sesion.idRecaudador,
                            pure: sesion.idPunto,
                            porVencer: credito.porVencer
                        };

                        $creditos.pagarCredito(pago).then(function (respuesta) {
                            if (respuesta.data.idFactura !== null && respuesta.data.numeroFactura !== "0") {
                                $ionicLoading.hide();
                                $scope.cerrarPago();
                                $scope.cerrarBusqueda();
                                $state.go('factura', { credito: JSON.stringify(respuesta.data), vista: 'factura' });
                            } else {
                                $ionicLoading.hide();
                                if (respuesta.data.valorMensaje !== null) {
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje + "$" + $filter('number')(respuesta.data.valorMensaje), "Aceptar", "button-fdlm");
                                } else {
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje, "Aceptar", "button-fdlm");
                                }
                            }
                        });
                    } else {
                        console.log('Pago cancelado');
                    }
                });
            } else if (valorPagar > credito.cuotaCredito) {
                popupConfirmacion = $ionicPopup.confirm({
                    title: 'Realizar pago de cuota',
                    template: 'Pago supera el valor de la cuota',
                    cancelText: 'Cancelar',
                    canceltype: 'button-cancelar',
                    okText: 'Aceptar',
                    okType: 'button-fdlm'
                });
                popupConfirmacion.then(function (res) {
                    if (res) {
                        var sesion = $autenticacion.obtenerSesion("sesion");
                        mostrarLoader($ionicLoading, "Pagando");

                        var pago = {
                            cuenta: credito.codigoCredito,
                            cuota: credito.cuotaCredito,
                            operacion: credito.operacion,
                            sucursal: credito.sucursalCliente,
                            producto: credito.idproducto,
                            tac: credito.tacCDS,
                            valor: valor,
                            idRecaudador: sesion.idRecaudador,
                            pure: sesion.idPunto,
                            porVencer: credito.porVencer
                        };

                        $creditos.pagarCredito(pago).then(function (respuesta) {
                            if (respuesta.data.idFactura !== null && respuesta.data.numeroFactura !== "0") {
                                $ionicLoading.hide();
                                $scope.cerrarPago();
                                $scope.cerrarBusqueda();
                                $state.go('factura', { credito: JSON.stringify(respuesta.data), vista: 'factura' });
                            } else {
                                $ionicLoading.hide();
                                if (respuesta.data.valorMensaje !== null) {
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje + "$" + $filter('number')(respuesta.data.valorMensaje), "Aceptar", "button-fdlm");
                                } else {
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje, "Aceptar", "button-fdlm");
                                }
                            }
                        }, function (error) {
                            $ionicLoading.hide();
                            mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                        });
                    } else {
                        console.log('Pago cancelado');
                    }
                });
            } else {
                if (valorPagar < credito.cuotaCredito) {
                    popupConfirmacion = $ionicPopup.confirm({
                        title: 'Realizar pago de cuota',
                        template: 'El valor a pagar es menor que la cuota. ¿Seguro que desea realizar el pago por ' + $filter('currency')(valor) + '?',
                        cancelText: 'Cancelar',
                        canceltype: 'button-cancelar',
                        okText: 'Aceptar',
                        okType: 'button-fdlm'
                    });
                    popupConfirmacion.then(function (res) {
                        if (res) {
                            var sesion = $autenticacion.obtenerSesion("sesion");
                            mostrarLoader($ionicLoading, "Pagando");

                            var pago = {
                                cuenta: credito.codigoCredito,
                                cuota: credito.cuotaCredito,
                                operacion: credito.operacion,
                                sucursal: credito.sucursalCliente,
                                producto: credito.idproducto,
                                tac: credito.tacCDS,
                                valor: valor,
                                idRecaudador: sesion.idRecaudador,
                                pure: sesion.idPunto,
                                porVencer: credito.porVencer
                            };

                            $creditos.pagarCredito(pago).then(function (respuesta) {
                                if (respuesta.data.idFactura !== null && respuesta.data.numeroFactura !== "0") {
                                    $ionicLoading.hide();
                                    $scope.cerrarPago();
                                    $scope.cerrarBusqueda();
                                    $state.go('factura', { credito: JSON.stringify(respuesta.data), vista: 'factura' });
                                } else {
                                    $ionicLoading.hide();
                                    if (respuesta.data.valorMensaje !== null) {
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje + "$" + $filter('number')(respuesta.data.valorMensaje), "Aceptar", "button-fdlm");
                                    } else {
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje, "Aceptar", "button-fdlm");
                                    }
                                }
                            }, function (error) {
                                $ionicLoading.hide();
                                mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                            });
                        } else {
                            console.log('Pago cancelado');
                        }
                    });
                } else {
                    popupConfirmacion = $ionicPopup.confirm({
                        title: 'Realizar pago de cuota',
                        template: '¿Seguro que desea realizar el pago por ' + $filter('currency')(valor) + '?',
                        cancelText: 'Cancelar',
                        canceltype: 'button-cancelar',
                        okText: 'Aceptar',
                        okType: 'button-fdlm'
                    });
                    popupConfirmacion.then(function (res) {
                        if (res) {
                            var sesion = $autenticacion.obtenerSesion("sesion");
                            mostrarLoader($ionicLoading, "Pagando");

                            var pago = {
                                cuenta: credito.codigoCredito,
                                cuota: credito.cuotaCredito,
                                operacion: credito.operacion,
                                sucursal: credito.sucursalCliente,
                                producto: credito.idproducto,
                                tac: credito.tacCDS,
                                valor: valor,
                                idRecaudador: sesion.idRecaudador,
                                pure: sesion.idPunto,
                                porVencer: credito.porVencer
                            };

                            $creditos.pagarCredito(pago).then(function (respuesta) {
                                if (respuesta.data.idFactura !== null && respuesta.data.numeroFactura !== "0") {
                                    $ionicLoading.hide();
                                    $scope.cerrarPago();
                                    $scope.cerrarBusqueda();
                                    $state.go('factura', { credito: JSON.stringify(respuesta.data), vista: 'factura' });
                                } else {
                                    $ionicLoading.hide();
                                    if (respuesta.data.valorMensaje !== null) {
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje + "$" + $filter('number')(respuesta.data.valorMensaje), "Aceptar", "button-fdlm");
                                    } else {
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "Falló el pago al crédito No. " + credito.codigoCredito + ". " + respuesta.data.mensaje, "Aceptar", "button-fdlm");
                                    }
                                }
                            }, function (error) {
                                $ionicLoading.hide();
                                mostrarAlerta($ionicPopup, NOMBRE_APP, error.statusText, "Aceptar", "button-fdlm");
                            });
                        } else {
                            console.log('Pago cancelado');
                        }
                    });
                }
            }
        };

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    });