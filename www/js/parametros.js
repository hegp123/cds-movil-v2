/* 
 * Archivo de parámetros generales de la aplicación
 * Desarrollado por: Roberto Chajin Ortiz - Visión Ingeniería S.A.S
 * Revisión No.: 1.0
 */

/**************************************************
 * Parámetros generales
 **************************************************/
var NOMBRE_APP = "CDS Móvil";
var VERSION_APP = "1.9";

/**************************************************
 * Parámetros de conexión Servicio Web
 **************************************************/
var URL_WS = "https://cds.app.fundaciondelamujer.com:8086/cdsws/apiv1";
//var URL_WS = "http://localhost:8081/cdsws/apiv1";

/**************************************************
 * Métodos del API
 **************************************************/
var EP_CREDITOS_CC = "/creditos/cedula/";
var EP_CREDITOS_CREDITO = "/creditos/credito/";
var EP_CREDITOS_SELECCION = "/creditos/seleccion/";
var EP_CREDITOS_NOMBRE = "/creditos/nombre/";
var EP_CREDITOS_PAGAR = "/creditos/pagar";
var EP_CREDITOS_INFO = "/creditos/info/";
var EP_REPORTE = "/reporte/obtener/";
var EP_FACTURAS = "/orden/obtener/";
var EP_SESION = "/sesion/login";
var EP_CLAVE = "/autenticacion/clave/";
var EP_VALIDAR_API = "/validar/api";
var EP_CLAVE_BLOQUEO = "/autenticacion/bloqueo/";
var EP_CLAVE_BLOQUEO_VAL = "/autenticacion/validarbloqueo/";
var EP_HEALTH = "/actuator/health";
