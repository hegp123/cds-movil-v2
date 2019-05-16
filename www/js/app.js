/* 
 * Archivo de configuración general de la aplicación
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

angular.module('cds', ['ionic', 'cds.app', 'cds.servicios', 'cds.login', 'cds.pagos', 'cds.reporte', 'cds.reimprimir', 'cds.factura', 'ngPassword'])

        .run(function ($ionicPlatform, $ionicPopup, $autenticacion, $ionicLoading, $state) {
            $ionicPlatform.ready(function () {
                document.addEventListener("backbutton", function (e) {
                    $autenticacion.logout();
                    navigator.app.exitApp();
                }, false);

                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);

                }
                if (window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleLightContent();
                }

                if (window.Connection) {
                    if (navigator.connection.type == Connection.NONE) {
                        $ionicPopup.alert({
                            title: NOMBRE_APP,
                            template: "No hay conexión a internet, verifique su conexión e ingrese nuevamente.",
                            buttons: [{
                                    text: "Aceptar",
                                    type: "button-fdlm",
                                    onTap: function (e) {
                                        console.log(e);
                                    }
                                }]
                        }).then(function (result) {
                            if (!result) {
                                navigator.app.exitApp();
                            }
                        });
                    } else {
                        $autenticacion.validarAPI().success(function (response, status, headers, config) {
                            // if (!response) {
                            //     $ionicLoading.hide();
                            //     mostrarAlerta($ionicPopup, NOMBRE_APP, "No hay conexión con el servicio, se intentará conectar al servicio alterno.", "Aceptar", "button-fdlm");
                            // }
                        }).error(function (data, status, headers, config) {
                            $ionicLoading.hide();
                            $autenticacion.logout();
                            $state.go('login');
                            // mostrarAlerta($ionicPopup, NOMBRE_APP, "El sistema se encuentra cerrado. Intente más tarde.", "Aceptar", "button-fdlm");
                        });
                    }
                }

                var timeoutID;

                function setup() {
                    this.addEventListener("mousemove", resetTimer, false);
                    this.addEventListener("mousedown", resetTimer, false);
                    this.addEventListener("keypress", resetTimer, false);
                    this.addEventListener("DOMMouseScroll", resetTimer, false);
                    this.addEventListener("mousewheel", resetTimer, false);
                    this.addEventListener("touchmove", resetTimer, false);
                    this.addEventListener("MSPointerMove", resetTimer, false);

                    startTimer();
                }
                setup();

                function startTimer() {
                    timeoutID = window.setTimeout(goInactive, 180000);
                }

                function resetTimer(e) {
                    window.clearTimeout(timeoutID);

                    goActive();
                }

                function goInactive() {
                    $autenticacion.logout();
                    navigator.app.exitApp();
                }

                function goActive() {
                    startTimer();
                }
            });
        })

        .directive("compararClave", function () {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compararClave"
                },
                link: function (scope, element, attributes, ngModel) {

                    ngModel.$validators.compararClave = function (modelValue) {
                        return modelValue == scope.otherModelValue;
                    };

                    scope.$watch("otherModelValue", function () {
                        ngModel.$validate();
                    });
                }
            };
        })

        .directive('passwordValidate', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue) {

                        scope.pwdValidLength = (viewValue && viewValue.length >= 8 ? 'valid' : undefined);
                        scope.pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? 'valid' : undefined;
                        scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;
                        //scope.pwdHasSymbol = (viewValue && /\W/.test(viewValue)) ? 'valid' : undefined; //por petición del dueño del producto no se valida el simbolo

                        if (scope.pwdValidLength && scope.pwdHasLetter && scope.pwdHasNumber) {
                            ctrl.$setValidity('pwd', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('pwd', false);
                            return undefined;
                        }

                    });
                }
            };
        })

        .directive('soloNumeros', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue) {

                        scope.pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? 'valid' : undefined;

                        if (scope.pwdHasNumber) {
                            ctrl.$setValidity('pwd', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('pwd', false);
                            return undefined;
                        }

                    });
                }
            };
        })

        .filter('miMoneda', ['$filter', function ($filter) {
                return function (input) {
                    input = parseInt(input);

                    if (input % 1 === 0) {
                        input = input.toFixed(0);
                    }
                    else {
                        input = input.toFixed(0);
                    }

                    return '$' + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                };
            }])

        .directive('sameAs', function () {
            return {
                require: 'ngModel',
                link: function (scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function (viewValue) {

                        if (viewValue === scope[attrs.sameAs]) {
                            ctrl.$setValidity('sameAs', true);
                            return viewValue;
                        } else {
                            ctrl.$setValidity('sameAs', false);
                            return undefined;
                        }
                    });
                }
            };
        })

        .directive('formatoPago', function ($filter) {
            return {
                require: 'ngModel',
                link: function (elem, $scope, attrs, ngModel) {
                    ngModel.$formatters.push(function (val) {
                        return $filter('number')(val);
                    });
                    ngModel.$parsers.push(function (val) {
                        return val.replace(/^\$/, '');
                    });
                }
            };
        })

        .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $stateProvider
                    // Ruta a la vista de inicio de sesión de la aplicación
                    .state('login', {
                        url: '/login',
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    })

                    // pestaña abstracta
                    .state('tab', {
                        url: '/tab',
                        abstract: true,
                        templateUrl: 'templates/tabs.html'
                    })

                    .state('tab.pagos', {
                        url: '/pagos',
                        views: {
                            'tab-pagos': {
                                templateUrl: 'templates/pagos.html',
                                controller: 'PagosCtrl'
                            }
                        }
                    })

                    .state('factura', {
                        url: '/factura/:credito/:vista',
                        templateUrl: 'templates/pagos/factura.html',
                        controller: 'FacturaCtrl'
                    })

                    .state('tab.reporte', {
                        url: '/reporte',
                        views: {
                            'tab-reporte': {
                                templateUrl: 'templates/reporte.html',
                                controller: 'ReporteCtrl'
                            }
                        }
                    })

                    .state('tab.reimprimir', {
                        url: '/reimprimir',
                        views: {
                            'tab-reimprimir': {
                                templateUrl: 'templates/reimprimir.html',
                                controller: 'ReimprimirCtrl'
                            }
                        }
                    });

            // vista que se lanza por defecto en la aplicación
            $urlRouterProvider.otherwise('/login');

        });
