'use strict';
angular.module("ngLocale", [], ["$provide", function ($provide) {
        var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
        $provide.value("$locale", {
            "DATETIME_FORMATS": {
                "AMPMS": [
                    "a.m.",
                    "p.m."
                ],
                "DAY": [
                    "Domingo",
                    "Lunes",
                    "Martes",
                    "Mi\u00e9rcoles",
                    "Jueves",
                    "Viernes",
                    "S\u00e1bado"
                ],
                "MONTH": [
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ],
                "SHORTDAY": [
                    "Dom",
                    "Lun",
                    "Mar",
                    "Mi\u00e9",
                    "Jue",
                    "Vie",
                    "S\u00e1b"
                ],
                "SHORTMONTH": [
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic"
                ],
                "fullDate": "EEEE, d 'de' MMMM 'de' y",
                "longDate": "d 'de' MMMM 'de' y",
                "medium": "d/MM/yyyy H:mm:ss",
                "mediumDate": "d/MM/yyyy",
                "mediumTime": "H:mm:ss",
                "short": "d/MM/yy H:mm",
                "shortDate": "d/MM/yy",
                "shortTime": "H:mm"
            },
            "NUMBER_FORMATS": {
                "CURRENCY_SYM": "\u0024",
                "DECIMAL_SEP": ",",
                "GROUP_SEP": ".",
                "PATTERNS": [
                    {
                        "gSize": 3,
                        "lgSize": 3,
                        "macFrac": 0,
                        "maxFrac": 3,
                        "minFrac": 0,
                        "minInt": 1,
                        "negPre": "-",
                        "negSuf": "",
                        "posPre": "",
                        "posSuf": ""
                    },
                    {
                        "gSize": 3,
                        "lgSize": 3,
                        "macFrac": 0,
                        "maxFrac": 2,
                        "minFrac": 2,
                        "minInt": 1,
                        "negPre": "\u00A4\u00a0-",
                        "negSuf": "",
                        "posPre": "\u00a0\u00a4",
                        "posSuf": ""
                    }
                ]
            },
            "id": "es-co",
            "pluralCat": function (n) {
                if (n == 1) {
                    return PLURAL_CATEGORY.ONE;
                }
                return PLURAL_CATEGORY.OTHER;
            }
        });
    }]);