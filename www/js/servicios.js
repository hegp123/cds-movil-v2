/* 
 * Servicios que se comparten en la aplicación
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds.servicios', [])
        .factory('$almacenamientoLocal', function ($window) {
            return {
                setObjeto: function (llave, valor) {
                    $window.localStorage[llave] = JSON.stringify(valor);
                },
                getObjeto: function (llave) {
                    return JSON.parse($window.localStorage[llave] || '{}');
                }
            };
        })

        .factory('$autenticacion', function ($http, $window, Base64) {
            var infoUsuario = null;
            var logueado = false;

            var respuesta = {
                usuario: infoUsuario,
                estado: logueado
            };

            function login(usuario) {
                return $http.post(URL_WS + EP_SESION, usuario);
            }

            function logout() {
                $window.localStorage.sesion = null;
            }

            function validarSesion() {
                return respuesta;
            }

            function cambiarClave(clave, nuevaClave, confirmarClave, idRecaudador, login) {
                return $http.get(URL_WS + EP_CLAVE + clave + "/" + nuevaClave + "/" + confirmarClave + "/" + idRecaudador + "/" + login);
            }

            function validarAPI() {
                return $http.post(URL_WS + EP_VALIDAR_API);
                //return $http.post(URL_WS + EP_HEALTH);
            }

            return {
                login: login,
                logout: logout,
                sesion: validarSesion,
                asignarSesion: function (llave, valor) {
                    $window.localStorage[llave] = JSON.stringify(valor);
                },
                obtenerSesion: function (llave) {
                    return JSON.parse($window.localStorage[llave] || '{}');
                },
                cambiarClave: cambiarClave,
                validarAPI: validarAPI
            };
        })

        .factory('$creditos', function ($http, Base64) {

            var authdata = Base64.encode("reca" + ':' + "reca");
            $http.defaults.headers.common.Authorization = 'Basic ' + authdata;

            function buscarPorCC(cedula, idPunto) {
                return $http.get(URL_WS + EP_CREDITOS_CC + cedula + "/" + idPunto);
            }

            function buscarPorCredito(credito, idPunto, purePrejuridico) {
                return $http.get(URL_WS + EP_CREDITOS_CREDITO + credito + "/" + idPunto);
            }

            function buscarPorSeleccion(credito, cuota, idproducto, tac, porVencer) {
                return $http.get(URL_WS + EP_CREDITOS_SELECCION + credito + "/" + cuota + "/" + idproducto + "/" + tac + "/" + porVencer);
            }

            function buscarPorNombre(nombre) {
                return $http.get(URL_WS + EP_CREDITOS_NOMBRE + nombre);
            }

            function pagarCredito(pago) {
                return $http.get(URL_WS + EP_CREDITOS_PAGAR + "/" + pago.cuenta + "/" + pago.operacion + "/" + pago.sucursal + "/" + pago.producto + "/" +
                        pago.valor + "/" + pago.idRecaudador + "/" + pago.tac + "/" + pago.pure + "/" + pago.cuota + "/" + pago.porVencer);
            }

            function infoPagosCredito(cuenta) {
                return $http.get(URL_WS + EP_CREDITOS_INFO + cuenta);
            }

            return {
                buscarPorCC: buscarPorCC,
                buscarPorCredito: buscarPorCredito,
                buscarPorNombre: buscarPorNombre,
                buscarPorSeleccion: buscarPorSeleccion,
                pagarCredito: pagarCredito,
                infoPagosCredito: infoPagosCredito
            };
        })

        .factory('$reporte', function ($http) {
            function buscarPagos(fecha, idpunto) {
                return $http.get(URL_WS + EP_REPORTE + fecha + "/" + idpunto);
            }

            return {
                buscarPagos: buscarPagos
            };
        })

        .factory('$facturas', function ($http) {
            function buscarFactura(factura, puntoReca, idRecaudador) {
                return $http.get(URL_WS + EP_FACTURAS + factura + "/" + puntoReca + "/" + idRecaudador);
            }

            return {
                buscarFactura: buscarFactura
            };
        })

        .factory('Base64', function () {
            /* jshint ignore:start */

            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            return {
                encode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    do {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);

                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;

                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        } else if (isNaN(chr3)) {
                            enc4 = 64;
                        }

                        output = output +
                                keyStr.charAt(enc1) +
                                keyStr.charAt(enc2) +
                                keyStr.charAt(enc3) +
                                keyStr.charAt(enc4);
                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";
                    } while (i < input.length);

                    return output;
                },
                decode: function (input) {
                    var output = "";
                    var chr1, chr2, chr3 = "";
                    var enc1, enc2, enc3, enc4 = "";
                    var i = 0;

                    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                    var base64test = /[^A-Za-z0-9\+\/\=]/g;
                    if (base64test.exec(input)) {
                        window.alert("There were invalid base64 characters in the input text.\n" +
                                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                                "Expect errors in decoding.");
                    }
                    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                    do {
                        enc1 = keyStr.indexOf(input.charAt(i++));
                        enc2 = keyStr.indexOf(input.charAt(i++));
                        enc3 = keyStr.indexOf(input.charAt(i++));
                        enc4 = keyStr.indexOf(input.charAt(i++));

                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;

                        output = output + String.fromCharCode(chr1);

                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }

                        chr1 = chr2 = chr3 = "";
                        enc1 = enc2 = enc3 = enc4 = "";

                    } while (i < input.length);

                    return output;
                }
            };

            /* jshint ignore:end */
        });
