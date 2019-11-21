/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global db */

var bd, cajadatos;
var indexedDB = window.indexedDB; //MIO
var database = null; //MIO

function iniciar() {

    //abre la conexion de la bd dietvito-05
    database = indexedDB.open("DietVito-05", 1);
    database.onupgradeneeded = function (e) {//MIO
        crearbd();
    };
    database.onsuccess = function (e) {//MIO
        alert('Database loaded');
        //loadAll();
    };
    database.onerror = function (e) { //MIO
        alert('Error loading database');
    };
    //solicitud.addEventListener("error", mostrarerror);
    //solicitud.addEventListener("success", comenzar);
    //solicitud.addEventListener("upgradeneeded", crearbd);

    if (document.getElementById("usuario") === null) {

    } else {
        sesionStorage();
    }

    if (document.title === "RegistrarUsuario") {
        //cajadatos = document.getElementById("cajadatos");
        alert("estamos en registro");
        nombre = document.getElementById("nombre");
        nombre.addEventListener("input", comprobacionRegistro);

        dni = document.getElementById("dni");
        dni.addEventListener("input", comprobacionRegistro);

        movil = document.getElementById("movil");
        movil.addEventListener("input", comprobacionRegistro);

        email = document.getElementById("email");
        email.addEventListener("input", comprobacionRegistro);

        contraseña = document.getElementById("contraseña");
        contraseña.addEventListener("input", comprobacionRegistro);

        cajadatos = document.getElementById("cajadatos");

        var archivos = document.getElementById("imagen");
        archivos.addEventListener("change", procesar);

        var botonRegistrarse = document.getElementById("registrarse");
        botonRegistrarse.addEventListener("click", agregarClientes);

//        var botonRegistrarse = document.getElementById("registrarse");
//        botonRegistrarse.addEventListener("click", sesionStorage);

    }

    //INICIAR SESION---------------------------------------------
    else if (document.title === "DietVito-Iniciar sesión") //EN ELLO
    {
        email = document.getElementById("#email");
        email.addEventListener("#email", comprobacionLogin);

        contraseña = document.getElementById("#contraseña");
        contraseña.addEventListener("#contraseña", comprobacionLogin);

        var botonLogin = document.getElementById("#btLogin");
        botonLogin.addEventListener("click", buscarEmail);
        
        //CUANDO SEA EL DIETISTA COMO ABRIMOS UNA PAGINA Y CUANDO EL CLIENTE LA OTRA???

//        var botonLogin = document.getElementById("btLogin");
//        botonLogin.addEventListener("click", sessionStorage);

    } 
//    else if (document.title === "Inicio")
//    {
//        alert("inicio");
//        lugar = document.getElementsByName("lugar");
//        //lugar.addEventListener("select", );
//
//        fechaI = document.getElementById("fechaI");
//        //fechaI.addEventListener("input", );
//
//        horaI = document.getElementById("horaI");
//        //horaI.addEventListener("input", );
//
//        fechaF = document.getElementById("fechaF");
//        //fechaF.addEventListener("input", );
//
//        horaF = document.getElementById("horaF");
//        //horaF.addEventListener("input", );
//
//
//        if (fechaI.value <= fechaF.value)
//        {
//            var botonBuscarCoche = document.getElementById("buton");
//            botonBuscarCoche.addEventListener("click", buscarCoche);
//        }
//    } else if (document.title === "Reserva")
//    {
//        alert("Entra a reservas");
//        coche = document.getElementsByName("coche").value;
//        //lugar.addEventListener("select", );
//
//        fechaI = document.getElementById("fechaI").value;
////        fechaI.addEventListener("input", comprobarFecha);
//
//        horaI = document.getElementById("horaI").value;
////        horaI.addEventListener("input", comprobarFecha);
//
//        fechaF = document.getElementById("fechaF").value;
////        fechaF.addEventListener("input", comprobarFecha);
//
//        horaF = document.getElementById("horaF").value;
////        horaF.addEventListener("input", comprobarFecha);
//
//        lugar = document.getElementsByName("lugar").value;
//        //lugar.addEventListener("select", );
//
//        var reserva = document.getElementById("btReserva");
//        reserva.addEventListener("click", agregarReserva);
//    } 

    //PAGINAS DE CONSULTA!!!!
    else if (document.title === "ConsultarReserva")
    {
        alert("Entra a reservas");
        fechaI = document.getElementById("fechaRI");
        fechaF = document.getElementById("fechaRF");

        var consultaReserva = document.getElementById("btConsulta");
        consultaReserva.addEventListener("click", recuperarReserva);
    }

}

function mostrarerror(evento) {
    alert("Error: " + evento.code + " " + evento.message);
}

function comenzar(evento)
{
    alert("comienzaaaaa");
    bd = evento.target.result;
}

//----------------CREAR LA BD----------------
function crearbd() {
    var active = database.result;

    //----------------TABLA CLIENTE----------------
    var almacen = active.createObjectStore("cliente", {keyPath: "email"});
    almacen.createIndex("porEmail", "email", {unique: true});

    almacen.add({email: "diet@diet.eus", contraseña: "diet2019"});

    //----------------TABLA ACTIVIDADES----------------
    var almacen1 = active.createObjectStore("actividades", {keyPath: "actividad"});
    almacen1.createIndex("porActividad", "actividad", {unique: true});
    //almacen1.createIndex("porDescripcion", "descripcion", {unique:false});
    //almacen1.createIndex("porCalorias", "calorias", {unique:false});

    almacen1.add({actividad: "correr", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({actividad: "nadar", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({actividad: "andar", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({actividad: "basket", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({actividad: "futbol", descripcion: "correr durante una hora", calorias: "x"});

    //----------------TABLA PESOS----------------
    var almacen2 = active.createObjectStore("pesoCliente", {keyPath: ["idUsuario", "fecha"]});
    almacen2.createIndex("porUsuario", ["idUsuario", "fecha"], {unique: true});

    //----------------TABLA REGISTRO ACTIVIDADES----------------
    var almacen3 = active.createObjectStore("actividadDiaria", {keyPath: ["idUsuario", "idActi", "fecha"]});
    almacen3.createIndex("porUsuario", ["idUsuario", "idActi", "fecha"], {unique: true});
}
function add() { //MIO
    var active = database.result;
    alert('ok' + active);
    var data = active.transaction(["cliente"], "readwrite");
    object = data.objectStore("cliente");

    //insert into
    var request = object.put({
        email: document.querySelector('#correo').value,
        contraseña: document.querySelector('#contraseña').value,
        nombre: document.querySelector('#nombre').value,
        peso: document.querySelector('#peso').value,
        altura: document.querySelector('#altura').value,
        foto: document.querySelector('#foto').value
    });
    request.onerror = function (e) {
        alert(request.error.name + '\n\n' + request.error.message);
    };
    request.oncomplete = function (e) { //NO SE VACIAN LOS CAMPOS 
        //para que se borren los campos para poder registrar otro
        document.querySelector('#correo').value = '';
        document.querySelector('#contraseña').value = '';
        document.querySelector('#nombre').value = '';
        document.querySelector('#peso').value = '';
        document.querySelector('#altura').value = '';
        document.querySelector('#foto').value = '';
        alert('se agrego correctamente el objeto');
    };
}
;

function addPeso() {
    //ESTA SIN HACER EL FORMULARIO
}
;

function addActividad() {
    var active = database.result;
    var data = active.transaction(["actividadDiaria"], "readwrite");
    object = data.objectStore("actividadDiaria");

    //insert into
    var request = object.put({
        idUsuario: '1', //COMO LO PONES SI ERES TU??
        actividad: document.querySelector('#listado').value,
        fecha: document.querySelector('#fecha').value
    });
    request.onerror = function (e) {
        alert(request.error.name + '\n\n' + request.error.message);
    };
    request.oncomplete = function (e) { //NO SE VACIAN LOS CAMPOS 
        //para que se borren los campos para poder registrar otro
        document.querySelector('#listado').value = '';
        document.querySelector('#fecha').value = '';
        alert('se agrego correctamente el objeto');
    };
}
;

function sesionStorage()
{
    //--------------Session storage----------------------------
    if (sessionStorage.length === 0)
    {
        if (localStorage.length === 0)
        {
            document.getElementById("usuario").innerHTML = "";
        } else
        {
            var datos = window.localStorage[ window.localStorage.length - 1];

            datos = JSON.parse(datos);

            document.getElementById("usuario").innerHTML = 'Hola, ' + datos[0];
        }
    } else
    {
        //el sesionStorage esta vacio, asi que cogemos datos
        //del localStorage del ultimo usuario que ha entrado
        var datos = window.sessionStorage[window.sessionStorage.length - 1];

        datos = JSON.parse(datos);

        alert("usuaaariiiioooo");

        var usuario = datos[0];
        document.getElementById("usuario").innerHTML = 'Hola, ' + usuario;

    }
}
////----------------REGISTRA A LOS USUARIOS----------------
//function agregarClientes() {
//    alert("agregar clientes");
//    if (comprobacionRegistro() === true)
//    {
//        var transaccion = bd.transaction(["usuarios"], "readwrite");
//        var almacen = transaccion.objectStore("usuarios");
//
//        var email = document.getElementById("email").value;
//        var contraseña = document.getElementById("contraseña").value;
//        var nombre = document.getElementById("nombre").value;
//        var pesoInicial = document.getElementById("pesoInicial").value;
//        var altura = document.getElementById("altura").value;
//        var foto = document.getElementById("foto").value;
//
//        var consulta = almacen.openCursor(email);
//        consulta.onsuccess = function (e)
//        {
//            var cursor = e.target.result;
//            if (cursor)
//            { // el email ya existe
//                alert("Ya existe ese usuario!");
//            } else
//            {
//                almacen.add({email: email, contraseña: contraseña, nombre: nombre, pesoInicial: pesoInicial, altura: altura, foto: foto});
//                alert("Se ha insertado correctamente");
//                var datos = new Array(); //Creamos un nuevo array vacío
//                datos[0] = nombre;
//                datos[1] = email;
//                datos[2] = contraseña;
//                datos[3] = pesoInicial;
//                datos[4] = altura;
//                datos[5] = foto;
//                //en sessionStorage cuando cierras la pestaña no se guarda la info
//                window.sessionStorage[ window.sessionStorage.length ] = JSON.stringify(datos);
//                //en localStorage cuando cierras la pestaña si se guarda la info
//                window.localStorage[ window.localStorage.length ] = JSON.stringify(datos);
//            }
//            ;
//        }
//    } else {
//        alert("Introduce los datos correctamente");
//    }
//}
function comprobacionRegistro() //CAMBIAR
{
    comprobarNombre(nombre.value);
    comprobarDNI(dni.value);
    comprobarMovil(movil.value);
    comprobarEmail(email.value);
    comprobarContraseña(contraseña.value);

    if (comprobarNombre(nombre.value) && comprobarDNI(dni.value) && comprobarMovil(movil.value) && comprobarEmail(email.value)
            && comprobarContraseña(contraseña.value) === true)
    {
        return true;
    }

}

//----------------LLENA LA TABLA ACTIVIDADES---------------- (NO LO HACE)
//Mirar ejemplo index3. El html llama al add(), y el add() al loadAll(). 
////Y el loadAll() en las lineas 138-139 especifica a qué load (o loadByDNI) referencia.
//Así que falta organisasion
function agregarActividades()
{
    var active = database.result;
    var transaccion = active.transaction(["actividades"], "readwrite");
    var almacen1 = transaccion.objectStore("actividades");
    var index = almacen1.index('porActividad');
    var elements = [];

    index.openCursor().onsuccess = function (e) {
        var result = e.target.result;

        if (result === null) {
            return;
        }

        elements.push(result.value);
        result.continue();
    };

    transaccion.complete = function () {
        var outerHTML = '';

        for (var key in elements) {

            outerHTML += '\n\
            <tr>\n\
                <td>' + elements[key].actividad + '</td>\n\
                <td>' + elements[key].descripcion + '</td>\n\
                <td>' + elements[key].calorias + '</td>\n\
                <td>\n\
                    <button type="button" onclick="load(' + elements[key].actividad + ');">Details</button>\n\
//                    <button type="button" onclick="loadByDni(' + elements[key].dni + ');">Details DNI</button>\n\
                </td>\n\
            </tr>';
        }

        elements = [];
        document.querySelector("#elementsList").innerHTML = outerHTML;
    };
//
//    almacen1.add({nombre: "correr", descripcion: "correr durante una hora", calorias: "x"});
//    almacen1.add({nombre: "nadar", descripcion: "correr durante una hora", calorias: "x"});
//    almacen1.add({nombre: "andar", descripcion: "correr durante una hora", calorias: "x"});
//    almacen1.add({nombre: "basket", descripcion: "correr durante una hora", calorias: "x"});
//    almacen1.add({nombre: "futbol", descripcion: "correr durante una hora", calorias: "x"});
//    //alert('Actividades añadidas a la base de datos');
//    loadAll();
//    
//    function load(actividad) {
//
////        var active = dataBase.result;
////        TRANSACCION  var data = active.transaction(["actividades"], "readonly");
////        ALMACEN1  var object = data.objectStore("actividades");
//
//        var request = object.get(parseInt(actividad));
//
//        request.onsuccess = function () {
//
//            var result = request.result;
//
//            if (result !== undefined) {
//                alert("ACTIVIDAD: " + result.actividad + "\n\
//                Actividad: " + result.nombre + "\n\
//                Descripción: " + result.descripcion + "\n\
//                Calorías: " + result.calorias);
//            }
//        };
//    }
//    
//    function loadAll() {
//       // var active = dataBase.result;
//                //var data = active.transaction(["people"], "readonly");
//               // var object = data.objectStore("people");
//                
//                var elements = [];
//                
//                object.openCursor().onsuccess = function (e) {
//                    
//                    var result = e.target.result;
//                    
//                    if (result === null) {
//                        return;
//                    }
//                    
//                    //Trae de la base de datos
//                    elements.push(result.value);
//                    result.continue();
//                    
//                };
//                
//                data.oncomplete = function() {
//                    
//                    var outerHTML = '';
//                    
//                    //Recorrer el array
//                    for (var key in elements) {
//                        
//                        //Se crean tablas para visualizar (no es obligatorio pero SÍ recomendable
//                        outerHTML += '\n\
//                        <tr>\n\
//                            <td>' + elements[key].actividad + '</td>\n\
//                            <td>' + elements[key].descripcion + '</td>\n\
//                            <td>' + elements[key].calorias + '</td>\n\
//                            <td>\n\
//                                <button type="button" onclick="load(' + elements[key].actividad + ');">Details</button>\n\
//                                <button type="button" onclick="loadByDni(' + elements[key].dni + ');">Details DNI</button>\n\
//                            </td>\n\
//                        </tr>';                        
//                    }
//                    
//                    elements = [];
//                    
//                    //Lo vuelca en el querySelector
//                    document.querySelector("#elementsList").innerHTML = outerHTML;
//                };             
//    }
//                   
}

//function agregarUsuario()
//{
//    alert("Entra a agregar usuario");
//
//    var transaccion = bd.transaction(["usuarios"], "readwrite");
//    var almacen2 = transaccion.objectStore("usuarios");
//
//    //var transaccion1 = bd.transaction(["coches"], "readonly");
//    //var almacen1 = transaccion1.objectStore("coches");
//
//    var nombre = document.getElementsByName("coche").value;
//    var email = document.getElementById("fechaI").value;
//    var contraseña = document.getElementById("horaI").value;
//    var pesoInicial = document.getElementById("fechaF").value;
//    var altura = document.getElementById("horaF").value;
//    var foto = document.getElementsByName("lugar").value;
//
//
//    var consulta = almacen2.openCursor(coche);
//    consulta.onsuccess = function (e)
//    {
//        alert("cursor");
//        var cursor = e.target.result;
//        if (cursor)
//        {
//            alert("coche ya reservado");
//        } else
//        {
//            alert("Se va ha agregar reserva");
//
//            almacen2.add({coche: coche, fechaI: fechaI, horaI: horaI, fechaF: fechaF, horaF: horaF, lugar: lugar});
//            alert("Se ha agregaddd(o reserva");
//        }
//    };
//
//}

//----------------MUESTRA LA TABLA DE ACTIVIDADES---------------- (NO LO HACE)
function obtActividades() //CAMBIADO A NUESTROS DATOS PARA OBTENER LA TABLA ACTIVIDADES
{

    var active = db.result;
    var data = active.transaction(["actividades"], "readonly");
    var object = data.objectStore("actividades");
    var elements = [];
    //Volcamos la información en un array y luego lo visualizamos

    object.openCursor().onsuccess = function (e) {
        var result = e.target.result;
        //Ha terminado la tabla
        if (result === null) {
            return;
        }

        elements.push(result.value);
        result.continue();//decir al bucle que continue, puntero al siguiente 
    };
    //Una vez recorrido todo
    data.oncomplete = function () {
        var outerHTML = '';
        for (var key in elements) {
            outerHTML += "<tr>" +
                    "<td>" + elements[key].nombre + "</td>" +
                    "<td>" + elements[key].descripcion + "</td>" +
                    "<td>" + elements[key].calorias + "</td>" +
                    "</tr>";
        }
        elements = [];
        //document.querySelector("").innerHTML = outerHTML; LINEA QUE HABIA ANTES
        document.getElementById("tablaActi").querySelector("").innerHTML = 'Hola, ' + usuario; //LINEA NUEVAQUE NO FUNCIONA
    };

}
function procesar(evento) {

    cajadatos.innerHTML = "";
    var archivos = evento.target.files;
    var archivo = archivos[0];
    var lector = new FileReader();
    lector.addEventListener("load", function (evento) {
        mostrar(evento, archivo);
    });
    lector.readAsBinaryString(archivo);

}

function mostrar(evento, archivo) {

    var url = URL.createObjectURL(archivo);
    var imagen = document.createElement("img");
    imagen.src = url;
    cajadatos.appendChild(imagen);

}

function comprobacionLogin() //NECESARIO
{
    comprobarEmail(email.value);
    comprobarContraseña(contraseña.value);

}

function comprobarEmail(pEmail) //NECESARIO
{
    var ex = /^([a-zA-Z]+[a-zA-Z0-9._-]*)@{1}([a-zA-Z0-9\.]{2,})\.([a-zA-Z]{2,3})$/;

    if (ex.test(pEmail) || pEmail === '')
    {
        email.style.background = '#FFFFFF';
        return true;
    } else
    {
        email.style.background = '#FFDDDD';
        return false;
    }
}

function comprobarContraseña(pContraseña) //NECESARIO
{
    var er = /^[a-zA-Z0-9]{4,16}$/;

    if (er.test(pContraseña) || pContraseña === '')
    {
        contraseña.style.background = '#FFFFFF';
        return true;
    } else
    {
        contraseña.style.background = '#FFDDDD';
        return false;
    }
}

//----------------VERIFICA EL LOGIN Y HACE EL HOLA NOSEQUIEN----------------
function buscarEmail()
{
    var emailABuscar = document.getElementById("email").value;
    var contraseñaABuscar = document.getElementById("contraseña").value;

    //----------- CONECTAR A LA BD ----------------   
    var transaccion = bd.transaction(["usuarios"], "readonly");
    var almacen = transaccion.objectStore("usuarios");
    var puntero = almacen.openCursor();
    var elementos = [];
    //---------------------------------------------

    puntero.onsuccess = function (e) {
        var result = e.target.result;
        if (result === null) {
            return;
        }
        elementos.push(result.value);
        result.continue();
    };

    transaccion.oncomplete = function ()
    {
        var encontrado = false;
        var i = 0;
        while (i < elementos.length && !encontrado)
        {
            if (elementos[i].email === emailABuscar && elementos[i].contraseña === contraseñaABuscar)
            {
                alert("Contraseña verificada");
                encontrado = true;

                var clave = elementos[i].email;
                var contraseña = elementos[i].contraseña;

                var datos = new Array();//Creamos un nuevo array vacío
                datos[0] = elementos[i].nombre;
                datos[1] = clave;
                datos[2] = contraseña;

                //en sessionStorage cuando cierras la pestaña no se guarda la info
                window.sessionStorage[ window.sessionStorage.length ] = JSON.stringify(datos);
                //en localStorage cuando cierras la pestaña si se guarda la info
                window.localStorage[ window.localStorage.length ] = JSON.stringify(datos);

                var usuario = elementos[i].nombre;

                document.getElementById("usuario").innerHTML = 'Hola, ' + usuario;

            } else if (elementos[i].email === emailABuscar && elementos[i].contraseña !== contraseñaABuscar)
            {
                alert("Contraseña incorrecta!!!!");
                encontrado = true;
            } else
            {
                i++;
            }
        }

        if (!encontrado)
            alert("El email no esta en la BD");
    };
}

//----------------CERRAR SESION----------------
function cerrarSesion() { //HECHO!
    alert("cierra sesion");
    sessionStorage.clear();
    localStorage.clear();
}

window.addEventListener("load", iniciar);
