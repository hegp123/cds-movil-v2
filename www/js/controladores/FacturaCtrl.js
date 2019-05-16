/* 
 * Controlador para el manejo de pagos
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.factura', [])

        .controller('FacturaCtrl', function ($scope, $state, $stateParams, $filter, $ionicPopup, $ionicLoading, $autenticacion) {
            $scope.infoFactura = JSON.parse($stateParams.credito);
            var sesion = $autenticacion.obtenerSesion("sesion");

            $scope.mostrarMensajeMora = false;
            $scope.mostrarMora = true;
            $scope.mostrarGSprocesal = true;
            $scope.mostrarPrejuridico = true;
            $scope.mostrarCapital = true;
            $scope.mostrarIcorrientes = true;
            $scope.mostrarHC = true;
            $scope.mostrarIva = true;
            $scope.mostrarSeguro = true;
            $scope.mostrarMensajeAbono = true;
            $scope.mensajeGlobal = sesion.mensajeGlobal;
            $scope.mostrarHonorarios = true;

            if (sesion.mensajePantalla !== null && sesion.mensajePantalla !== "") {
                $scope.mensajePantalla = sesion.mensajePantalla;
            }

            if ($stateParams.vista === 'factura') {
                $scope.mostrarFactura = false;
                $scope.nombreVista = "Pago realizado con éxito";

                $scope.mostrarBotonCerrar = true;
                $scope.mostrarBoton = false;

                $scope.$on("$ionicView.afterEnter", function () {
                    bluetoothSerial.isEnabled(function () {
                        bluetoothSerial.list(function (devices) {
                            mostrarLoader($ionicLoading, "Imprimiendo");
                            devices.forEach(function (device) {
                                var factura = "\r\n \r\n \r\n" +
                                        "Fundacion delamujer \r\n" +
                                        "NIT. 901.128.535-8 \r\n" +
                                        "Fecha: " + $scope.infoFactura.fecha + " \r\n" +
                                        "AG: " + $scope.infoFactura.agencia + " \r\n" +
                                        "\r\n" +
                                        "ORDEN DE RECIBO POR CDS NO.: \r\n" + $scope.infoFactura.numeroFactura + "\r\n" +
                                        "\r\n" +
                                        "Cliente: " + $scope.infoFactura.cliente + " \r\n" +
                                        "Documento identidad: " + $filter('number')($scope.infoFactura.cedulaCliente) + "\r\n";

                                //if ($scope.infoFactura.tipoAbono !== "") {
                                    //factura += "Concepto: " + $scope.infoFactura.tipoAbono +  " a credito "  + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                //} else {
                                    factura += "Concepto: Abono Credito " + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                //}

                                // if ($scope.infoFactura.capital > 0) {
                                //     factura += "Capital: $" + $filter('number')($scope.infoFactura.capital) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.icorrientes > 0) {
                                //     factura += "Intereses Corrientes: $" + $filter('number')($scope.infoFactura.icorrientes) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.honorariosComisiones > 0) {
                                //     factura += "Honorarios y Comisiones: $" + $filter('number')($scope.infoFactura.honorariosComisiones) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.iva > 0) {
                                //     factura += "IVA: $" + $filter('number')($scope.infoFactura.iva) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.seguro > 0) {
                                //     factura += "Seguro: $" + $filter('number')($scope.infoFactura.seguro) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.mora > 0) {
                                //     factura += "Mora: $" + $filter('number')($scope.infoFactura.mora) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.gprocesales > 0) {
                                //     factura += "Gastos Procesales: $" + $filter('number')($scope.infoFactura.gprocesales) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.prejuridico > 0) {
                                //     factura += "Prejuridico: $" + $filter('number')($scope.infoFactura.prejuridico) + ",00 \r\n";
                                // }

                                // if ($scope.infoFactura.honorarios > 0) {
                                //     factura += "Jur-Ing para terceros: $" + $filter('number')($scope.infoFactura.honorarios) + ",00 \r\n";
                                // }

                                factura += "Valor pagado: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n";

                                //+ "Jur-Ing para terceros: $" + $filter('number')(141837) + ",00 \r\n"
                                factura += "------ \r\n" +
                                        "Total: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n \r\n";

                                if ($scope.infoFactura.mensaje !== "" && $scope.infoFactura.mensaje !== null) {
                                    factura += "Mensaje: " + $scope.infoFactura.mensaje + " \r\n" +
                                            sesion.mensajeImpresion + " \r\n \r\n" +
                                            "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                            "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                            "\r\n \r\n \r\n";
                                } else {
                                    factura += sesion.mensajeImpresion + " \r\n \r\n" +
                                            "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                            "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                            "\r\n \r\n \r\n";
                                }
                                bluetoothSerial.connect(device.address, function () {
                                    bluetoothSerial.write(factura, function () {
                                        $ionicLoading.hide();
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "OR No. " + $scope.infoFactura.numeroFactura + " generada con éxito", "Aceptar", "button-fdlm");
                                        bluetoothSerial.disconnect(function () {
                                            console.log("Impresora desconectada");
                                        }, function () {
                                            console.log("No fue posible desconectar la impresora");
                                        });
                                    }, function () {
                                        $ionicLoading.hide();
                                        mostrarAlerta($ionicPopup, NOMBRE_APP, "No se imprimió la Orden de Recibo", "Aceptar", "button-fdlm");
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
                                                    "Fundacion delamujer \r\n" +
                                                    "NIT. 901.128.535-8 \r\n" +
                                                    "Fecha: " + $scope.infoFactura.fecha + " \r\n" +
                                                    "AG: " + $scope.infoFactura.agencia + " \r\n" +
                                                    "\r\n" +
                                                    "ORDEN DE RECIBO POR CDS NO.: \r\n" + $scope.infoFactura.numeroFactura + "\r\n" +
                                                    "\r\n" +
                                                    "Cliente: " + $scope.infoFactura.cliente + " \r\n" +
                                                    "Documento identidad: " + $filter('number')($scope.infoFactura.cedulaCliente) + "\r\n";

                                            // if ($scope.infoFactura.tipoAbono !== "") {
                                            //     factura += "Concepto: " + $scope.infoFactura.tipoAbono + " a credito "  + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                            // } else {
                                            //     factura += "Concepto: Abono Credito " + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                            // }

                                            // if ($scope.infoFactura.capital > 0) {
                                            //     factura += "Capital: $" + $filter('number')($scope.infoFactura.capital) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.icorrientes > 0) {
                                            //     factura += "Intereses Corrientes: $" + $filter('number')($scope.infoFactura.icorrientes) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.honorariosComisiones > 0) {
                                            //     factura += "Honorarios y Comisiones: $" + $filter('number')($scope.infoFactura.honorariosComisiones) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.iva > 0) {
                                            //     factura += "IVA: $" + $filter('number')($scope.infoFactura.iva) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.seguro > 0) {
                                            //     factura += "Seguro: $" + $filter('number')($scope.infoFactura.seguro) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.mora > 0) {
                                            //     factura += "Mora: $" + $filter('number')($scope.infoFactura.mora) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.gprocesales > 0) {
                                            //     factura += "Gastos Procesales: $" + $filter('number')($scope.infoFactura.gprocesales) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.prejuridico > 0) {
                                            //     factura += "Prejuridico: $" + $filter('number')($scope.infoFactura.prejuridico) + ",00 \r\n";
                                            // }

                                            // if ($scope.infoFactura.honorarios > 0) {
                                            //     factura += "Jur-Ing para terceros: $" + $filter('number')($scope.infoFactura.honorarios) + ",00 \r\n";
                                            // }

                                            factura += "Valor pagado: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n";

                                            //+ "Jur-Ing para terceros: $" + $filter('number')(141837) + ",00 \r\n"
                                            factura += "------ \r\n" +
                                                    "Total: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n \r\n";

                                            if ($scope.infoFactura.mensaje !== "" && $scope.infoFactura.mensaje !== null) {
                                                factura += "Mensaje: " + $scope.infoFactura.mensaje + " \r\n" +
                                                        sesion.mensajeImpresion + " \r\n \r\n" +
                                                        "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                                        "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                                        "\r\n \r\n \r\n";
                                            } else {
                                                factura += sesion.mensajeImpresion + " \r\n \r\n" +
                                                        "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                                        "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                                        "\r\n \r\n \r\n";
                                            }
                                            bluetoothSerial.connect(device.address, function () {
                                                bluetoothSerial.write(factura, function () {
                                                    $ionicLoading.hide();
                                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "OR No. " + $scope.infoFactura.numeroFactura + " generada con éxito", "Aceptar", "button-fdlm");
                                                    bluetoothSerial.disconnect(function () {
                                                        console.log("Impresora desconectada");
                                                    }, function () {
                                                        console.log("No fue posible desconectar la impresora");
                                                    });
                                                }, function () {
                                                    $ionicLoading.hide();
                                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "No se imprimió la Orden de Recibo", "Aceptar", "button-fdlm");
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
                });
            } else {
                $scope.mostrarFactura = true;
                $scope.nombreVista = "Reimpresión de Orden de Recibo";
                $scope.mostrarBoton = true;
                $scope.mostrarBotonCerrar = true;
            }

            if ($scope.infoFactura.mensaje !== "" && $scope.infoFactura.mensaje !== null) {
                $scope.mostrarMensajeMora = true;
            }

            if ($scope.infoFactura.tipoAbono !== "") {
                $scope.mostrarMensajeAbono = false;
                $scope.mensajeAbonoParametrizado = $scope.infoFactura.tipoAbono;
            }

            if ($scope.infoFactura.capital > 0) {
                $scope.mostrarCapital = false;
            }

            if ($scope.infoFactura.icorrientes > 0) {
                $scope.mostrarIcorrientes = false;
            }

            if ($scope.infoFactura.honorariosComisiones > 0) {
                $scope.mostrarHC = false;
            }

            if ($scope.infoFactura.iva > 0) {
                $scope.mostrarIva = false;
            }

            if ($scope.infoFactura.seguro > 0) {
                $scope.mostrarSeguro = false;
            }

            if ($scope.infoFactura.mora > 0) {
                $scope.mostrarMora = false;
            }

            if ($scope.infoFactura.gprocesales > 0) {
                $scope.mostrarGSprocesal = false;
            }

            if ($scope.infoFactura.prejuridico > 0) {
                $scope.mostrarPrejuridico = false;
            }

            if ($scope.infoFactura.honorarios > 0) {
                $scope.mostrarHonorarios = false;
            }

            $scope.reimprimir = function () {
                var reimp = "";

                if ($scope.mostrarFactura) {
                    reimp = " - REIMPRESION";
                }

                bluetoothSerial.isEnabled(function () {
                    bluetoothSerial.list(function (devices) {
                        mostrarLoader($ionicLoading, "Imprimiendo");
                        devices.forEach(function (device) {
                            var factura = "\r\n \r\n \r\n" +
                                    "Fundacion delamujer \r\n" +
                                    "NIT. 901.128.535-8 \r\n" +
                                    "Fecha: " + $scope.infoFactura.fecha + " \r\n" +
                                    "AG: " + $scope.infoFactura.agencia + " \r\n" +
                                    "\r\n" +
                                    "ORDEN DE RECIBO POR CDS NO.: \r\n" + $scope.infoFactura.numeroFactura + "\r\n" +
                                    "\r\n" +
                                    reimp + "\r\n" +
                                    "Cliente: " + $scope.infoFactura.cliente + " \r\n" +
                                    "Documento identidad: " + $filter('number')($scope.infoFactura.cedulaCliente) + "\r\n";
                            //if ($scope.infoFactura.tipoAbono !== "") {
                                //factura += "Concepto: " + $scope.infoFactura.tipoAbono + " a credito "  + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                            //} else {
                                factura += "Concepto: Abono Credito " + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                            //}

                            // if ($scope.infoFactura.capital > 0) {
                            //     factura += "Capital: $" + $filter('number')($scope.infoFactura.capital) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.icorrientes > 0) {
                            //     factura += "Intereses Corrientes: $" + $filter('number')($scope.infoFactura.icorrientes) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.honorariosComisiones > 0) {
                            //     factura += "Honorarios y Comisiones: $" + $filter('number')($scope.infoFactura.honorariosComisiones) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.iva > 0) {
                            //     factura += "IVA: $" + $filter('number')($scope.infoFactura.iva) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.seguro > 0) {
                            //     factura += "Seguro: $" + $filter('number')($scope.infoFactura.seguro) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.mora > 0) {
                            //     factura += "Mora: $" + $filter('number')($scope.infoFactura.mora) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.gprocesales > 0) {
                            //     factura += "Gastos Procesales: $" + $filter('number')($scope.infoFactura.gprocesales) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.prejuridico > 0) {
                            //     factura += "Prejuridico: $" + $filter('number')($scope.infoFactura.prejuridico) + ",00 \r\n";
                            // }

                            // if ($scope.infoFactura.honorarios > 0) {
                            //     factura += "Jur-Ing para terceros: $" + $filter('number')($scope.infoFactura.honorarios) + ",00 \r\n";
                            // }

                            factura += "Valor pagado: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n";

                            factura += "------ \r\n" +
                                    "Total: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n \r\n";

                            if ($scope.infoFactura.mensaje !== "" && $scope.infoFactura.mensaje !== null) {
                                factura += "Mensaje: " + $scope.infoFactura.mensaje + " \r\n" +
                                        sesion.mensajeImpresion + " \r\n \r\n" +
                                        "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                        "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                        "\r\n \r\n \r\n";
                            } else {
                                factura += sesion.mensajeImpresion + " \r\n \r\n" +
                                        "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                        "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                        "\r\n \r\n \r\n";
                            }
                            bluetoothSerial.connect(device.address, function () {
                                bluetoothSerial.write(factura, function () {
                                    $ionicLoading.hide();
                                    mostrarAlerta($ionicPopup, NOMBRE_APP, "OR No. " + $scope.infoFactura.numeroFactura + " generada con éxito", "Aceptar", "button-fdlm");
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
                                        var factura = "\r\n \r\n \r\n" +
                                                "Fundacion delamujer \r\n" +
                                                "NIT. 901.128.535-8 \r\n" +
                                                "Fecha: " + $scope.infoFactura.fecha + " \r\n" +
                                                "AG: " + $scope.infoFactura.agencia + " \r\n" +
                                                "\r\n" +
                                                "ORDEN DE RECIBO POR CDS NO.: \r\n" + $scope.infoFactura.numeroFactura + "\r\n" +
                                                "\r\n" +
                                                reimp + "\r\n" +
                                                "Cliente: " + $scope.infoFactura.cliente + " \r\n" +
                                                "Documento identidad: " + $filter('number')($scope.infoFactura.cedulaCliente) + "\r\n";
                                        //if ($scope.infoFactura.tipoAbono !== "") {
                                          //  factura += "Concepto: " + $scope.infoFactura.tipoAbono + " a credito "  + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                        //} else {
                                            factura += "Concepto: Abono Credito " + $scope.infoFactura.codigoCredito + " \r\n \r\n";
                                        //}

                                        // if ($scope.infoFactura.capital > 0) {
                                        //     factura += "Capital: $" + $filter('number')($scope.infoFactura.capital) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.icorrientes > 0) {
                                        //     factura += "Intereses Corrientes: $" + $filter('number')($scope.infoFactura.icorrientes) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.honorariosComisiones > 0) {
                                        //     factura += "Honorarios y Comisiones: $" + $filter('number')($scope.infoFactura.honorariosComisiones) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.iva > 0) {
                                        //     factura += "IVA: $" + $filter('number')($scope.infoFactura.iva) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.seguro > 0) {
                                        //     factura += "Seguro: $" + $filter('number')($scope.infoFactura.seguro) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.mora > 0) {
                                        //     factura += "Mora: $" + $filter('number')($scope.infoFactura.mora) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.gprocesales > 0) {
                                        //     factura += "Gastos Procesales: $" + $filter('number')($scope.infoFactura.gprocesales) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.prejuridico > 0) {
                                        //     factura += "Prejuridico: $" + $filter('number')($scope.infoFactura.prejuridico) + ",00 \r\n";
                                        // }

                                        // if ($scope.infoFactura.honorarios > 0) {
                                        //     factura += "Jur-Ing para terceros: $" + $filter('number')($scope.infoFactura.honorarios) + ",00 \r\n";
                                        // }

                                        factura += "Valor pagado: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n";

                                        factura += "------ \r\n" -
                                                "Total: $" + $filter('number')($scope.infoFactura.total) + ",00 \r\n \r\n";

                                        if ($scope.infoFactura.mensaje !== "" && $scope.infoFactura.mensaje !== null) {
                                            factura += "Mensaje: " + $scope.infoFactura.mensaje + " \r\n" +
                                                    sesion.mensajeImpresion + " \r\n \r\n" +
                                                    "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                                    "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                                    "\r\n \r\n \r\n";
                                        } else {
                                            factura += sesion.mensajeImpresion + " \r\n \r\n" +
                                                    "PROMOCION: " + sesion.mensajeGlobal + " \r\n \r\n" +
                                                    "CODIGO DE SEGURIDAD: " + $scope.infoFactura.codigoSeguridad + " \r\n" +
                                                    "\r\n \r\n \r\n";
                                        }
                                        bluetoothSerial.connect(device.address, function () {
                                            bluetoothSerial.write(factura, function () {
                                                $ionicLoading.hide();
                                                mostrarAlerta($ionicPopup, NOMBRE_APP, "Factura No. " + $scope.infoFactura.numeroFactura + " generada con éxito", "Aceptar", "button-fdlm");
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

            $scope.cerrarFactura = function () {
                if ($stateParams.vista === 'factura') {
                    $state.go('tab.pagos');
                } else {
                    $state.go('tab.reimprimir');
                }
            };
        });