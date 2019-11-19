/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global db */

var bd, cajadatos;
var idb = [];

function iniciar() {

    var solicitud = window.indexedDB.open("DietVito-05", 1);
    solicitud.addEventListener("error", mostrarerror);
    solicitud.addEventListener("success", comenzar);
    solicitud.addEventListener("upgradeneeded", crearbd);

    if (document.getElementById("usuario") === null){

    } 
    else{
        sesionStorage();
    }
    
    if (document.title === "Registro"){
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
    else if (document.title === "Login")
    {
//        nick = document.getElementById("nick");
//        nick.addEventListener("input", comprobacionLogin);

        email = document.getElementById("email");
        email.addEventListener("input", comprobacionLogin);

        contraseña = document.getElementById("contraseña");
        contraseña.addEventListener("input", comprobacionLogin);

        var botonLogin = document.getElementById("btLogin");
        botonLogin.addEventListener("click", buscarEmail);

//        var botonLogin = document.getElementById("btLogin");
//        botonLogin.addEventListener("click", sessionStorage);



    } else if (document.title === "Inicio")
    {
        alert("inicio");
        lugar = document.getElementsByName("lugar");
        //lugar.addEventListener("select", );

        fechaI = document.getElementById("fechaI");
        //fechaI.addEventListener("input", );

        horaI = document.getElementById("horaI");
        //horaI.addEventListener("input", );

        fechaF = document.getElementById("fechaF");
        //fechaF.addEventListener("input", );

        horaF = document.getElementById("horaF");
        //horaF.addEventListener("input", );


        if (fechaI.value <= fechaF.value)
        {
            var botonBuscarCoche = document.getElementById("buton");
            botonBuscarCoche.addEventListener("click", buscarCoche);
        }
    } else if (document.title === "Reserva")
    {
        alert("Entra a reservas");
        coche = document.getElementsByName("coche").value;
        //lugar.addEventListener("select", );

        fechaI = document.getElementById("fechaI").value;
//        fechaI.addEventListener("input", comprobarFecha);

        horaI = document.getElementById("horaI").value;
//        horaI.addEventListener("input", comprobarFecha);

        fechaF = document.getElementById("fechaF").value;
//        fechaF.addEventListener("input", comprobarFecha);

        horaF = document.getElementById("horaF").value;
//        horaF.addEventListener("input", comprobarFecha);

        lugar = document.getElementsByName("lugar").value;
        //lugar.addEventListener("select", );

        var reserva = document.getElementById("btReserva");
        reserva.addEventListener("click", agregarReserva);
    } else if (document.title === "ConsultarReserva")
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

function crearbd(evento) {
    var basededatos = evento.target.result;

    var almacen = basededatos.createObjectStore("clientes", {keyPath: "email"});
    almacen.createIndex("porEmail", "email", {unique: true});

    var almacen1 = basededatos.createObjectStore("coches", {keyPath: "matricula"});
    almacen1.createIndex("porMatricula", "matricula", {unique: true});

    almacen1.add({matricula: "4444", marca: "honda"});
    almacen1.add({matricula: "5555", marca: "bmw"});
    almacen1.add({matricula: "7777", marca: "ford"});
    almacen1.add({matricula: "1111", marca: "audi"});


    var almacen2 = basededatos.createObjectStore("reservas", {keyPath: "coche"});
    almacen2.createIndex("porCoche", "coche", {unique: false});

//    almacen2.createIndex("porEmail", "email", {unique: false});
//    almacen2.createIndex("porFecha", "fecha", {unique: false});


}

function sesionStorage()
{

//    var transaccion = bd.transaction(["clientes"],"readwrite");
//        var almacen = transaccion.objectStore("clientes");
//        var puntero = almacen.openCursor();
//        var elementos = [];
//
//        puntero.onsuccess = function (e) {
//            var result = e.target.result;
//            if (result === null) {
//                return;
//            }
//            elementos.push(result.value);
//            result.continue();
//        };
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

    //---------------------------------------
}

function agregarClientes() {
    alert("agregar clientes");
    if (comprobacionRegistro() === true)
    {
        var transaccion = bd.transaction(["clientes"], "readwrite");
        var almacen = transaccion.objectStore("clientes");

        var email = document.getElementById("email").value;
        var contraseña = document.getElementById("contraseña").value;
        var nombre = document.getElementById("nombre").value;
        var dni = document.getElementById("dni").value;
        var movil = document.getElementById("movil").value;


        // transaccion.addEventListener("complete", mostrar);

        var consulta = almacen.openCursor(email);
        consulta.onsuccess = function (e)
        {
            var cursor = e.target.result;
            if (cursor)
            { // el email ya existe
                alert("Ya existe ese usuario!");
            } else
            {
                almacen.add({email: email, contraseña: contraseña, nombre: nombre, dni: dni, movil: movil});
                alert("Se ha insertado correctamente");

//                var datos = new Array();//Creamos un nuevo array vacío
//                datos[0] = nombre;
//                datos[1] = email;
//                datos[2] = contraseña;
//
//                //en sessionStorage cuando cierras la pestaña no se guarda la info
//                window.sessionStorage[ window.sessionStorage.length ] = JSON.stringify(datos);
//                //en localStorage cuando cierras la pestaña si se guarda la info
//                window.localStorage[ window.localStorage.length ] = JSON.stringify(datos);

                //document.getElementById("usuario").innerHTML = 'Hola, ' + nombre;

//                almacen.add({email: email, contraseña: contraseña, nombre: nombre, dni: dni, movil: movil});
//                alert("Se ha insertado correctamente");
            }

            var datos = new Array();//Creamos un nuevo array vacío
            datos[0] = nombre;
            datos[1] = email;
            datos[2] = contraseña;

            //en sessionStorage cuando cierras la pestaña no se guarda la info
            window.sessionStorage[ window.sessionStorage.length ] = JSON.stringify(datos);
            //en localStorage cuando cierras la pestaña si se guarda la info
            window.localStorage[ window.localStorage.length ] = JSON.stringify(datos);

        };

    } else
    {
        alert("Introduce datos correctos");
    }
}

function agregarActividades()
{
    var transaccion = bd.transaction(["actividades"], "readwrite");
    var almacen1 = transaccion.objectStore("actividades");

    almacen1.add({nombre: "correr", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({nombre: "nadar", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({nombre: "andar", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({nombre: "basket", descripcion: "correr durante una hora", calorias: "x"});
    almacen1.add({nombre: "futbol", descripcion: "correr durante una hora", calorias: "x"});
    
//    
//    const customerData = [
//        {matricula: "4444", marca:"honda"},
//        {matricula: "5555", marca:"bmw"},
//        {matricula: "7777", marca:"ford"},
//        {matricula: "1111", marca:"audi"}
//    ];
//    
//    almacen1.transaction.oncomplete = function (event) {
//        //var customerObjectStore = bd.transaction("coches", "readwrite").objectStore("coches");
//        for (var i in customerData) {
//            almacen1.add(customerData[i]);
//        }
//    }

    //var almacen1 = transaccion.objectStore("coches");
//    for (var i in customerData) {
//        var request = almacen1.push(customerData[i]);
//        request.onsuccess = function (event) {
//            event.target.result === customerData[i].matricula;
//        };
//    }

}


function agregarReserva()
{
    alert("Entra a agregar reservas");

    var transaccion = bd.transaction(["reservas"], "readwrite");
    var almacen2 = transaccion.objectStore("reservas");

    var transaccion1 = bd.transaction(["coches"], "readonly");
    var almacen1 = transaccion1.objectStore("coches");


    var coche = document.getElementsByName("coche").value;
    var fechaI = document.getElementById("fechaI").value;
    var horaI = document.getElementById("horaI").value;
    var fechaF = document.getElementById("fechaF").value;
    var horaF = document.getElementById("horaF").value;
    var lugar = document.getElementsByName("lugar").value;


    var consulta = almacen2.openCursor(coche);
    consulta.onsuccess = function (e)
    {
        alert("cursor");
        var cursor = e.target.result;
        if (cursor)
        {
            alert("coche ya reservado");
        } else
        {
            alert("Se va ha agregar reserva");

            almacen2.add({coche: coche, fechaI: fechaI, horaI: horaI, fechaF: fechaF, horaF: horaF, lugar: lugar});
            alert("Se ha agregaddd(o reserva");

//                if(true){
//                    alert("Se va ha agregar reserva");
//                    
//                    almacen2.add({coche: coche, fechaI: fechaI, horaI: horaI, fechaF: fechaF, horaF: horaF, lugar: lugar});
//                    alert("Se ha agregado reserva" );
//
//                }
//                else { 
//                    alert("La fecha de devolución no puede ser anterior a la de recogida");
//
//                }
        }
    };

}

function recuperarReserva()
{
    alert("boton reserva");


    if (f1.value <= f2.value) {
        alert("La fecha valida");

        //falta conseguir el email que hace la consulta
        obtReserva;

    } else {
        alert("La fecha final no es valida");

    }
}

function obtReserva()
{

    var active = db.result;
    var data = active.transaction(["reservas"], "readonly");
    var object = data.objectStore("reservas");
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
                    "<td>" + elements[key].coche + "</td>" +
                    "<td>" + elements[key].fechaI + "</td>" +
                    "<td>" + elements[key].horaI + "</td>" +
                    "<td>" + elements[key].fechaF + "</td>" +
                    "<td>" + elements[key].horaF + "</td>" +
                    "<td>" + elements[key].lugar + "</td>" +
                    "</tr>";
        }
        elements = [];
        document.querySelector("").innerHTML = outerHTML;
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

function comprobacionRegistro()
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

function comprobacionLogin()
{
    comprobarEmail(email.value);

    comprobarContraseña(contraseña.value);

}

function comprobarEmail(pEmail)
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

function comprobarContraseña(pContraseña)
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

//function comprobarMovil(pMovil)
//{
//    var er = /^[0-9]{9}$/;
//
//    if (er.test(pMovil) || pMovil === '')
//    {
//        movil.style.background = '#FFFFFF';
//        return true;
//    } else
//    {
//        movil.style.background = '#FFDDDD';
//        return false;
//    }
//}

//function comprobarDNI(pDNI)
//{
//    var er = /^[0-9]{8}$/;
//
//    if (er.test(pDNI) || pDNI === '')
//    {
//        dni.style.background = '#FFFFFF';
//        return true;
//    } else
//    {
//        dni.style.background = '#FFDDDD';
//        return false;
//    }
//}

function comprobarNombre(pNombre)
{
    var er = /^[a-zA-Z]{3,12}$/;

    if (er.test(pNombre) || pNombre === '')
    {
        nombre.style.background = '#FFFFFF';
        return true;
    } else
    {
        nombre.style.background = '#FFDDDD';
        return false;
    }
}
function comprobarFecha()
{
    if (document.title === "Inicio" || document.title === "Reserva")
    {
        if (fechaI.value < fechaF.value)
        {
            alert("fecha introducida correcta");
            return true;
        } else if (fechaI.value === fechaF.value)
        {
            if (horaI.value < horaF.value)
            {
                alert("hora correcta");
                return true;
            } else
            {
                alert("la hora de devolución no puede ser anterior a la entrega");
            }
        } else
        {
            alert("la fecha de devolución no puede ser anterior a la de entrega");
        }
    } else if (document.title === "ConsultarReserva")
    {
        if (fechaI.value < fechaF.value)
        {
            alert("fecha introducida correcta");
            return true;
        } else
        {
            alert("la hora de devolución no puede ser anterior a la entrega");
        }
    }

}
function buscarEmail()
{
    var emailABuscar = document.getElementById("email").value;
    var passwordABuscar = document.getElementById("contraseña").value;
    //var passwordABuscar = md5( document.getElementById("contraseña").value );

    //----------- CONECTAR A LA BD ----------------   
    var transaccion = bd.transaction(["clientes"], "readonly");
    var almacen = transaccion.objectStore("clientes");
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
            if (elementos[i].email === emailABuscar && elementos[i].contraseña === passwordABuscar)
            {
                alert("Contraseña verificada");
                encontrado = true;

//                var usuario = document.getElementById("nick").value;
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

//                //en sessionStorage cuando cierras la pestaña no se guarda la info
//                window.sessionStorage[ clave ] = usuario; 
//                //en localStorage cuando cierras la pestaña si se guarda la info
//                window.localStorage[ window.localStorage.length ] = usuario;

                var usuario = elementos[i].nombre;

                //alert("usuaaariiiioooo");

                document.getElementById("usuario").innerHTML = 'Hola, ' + usuario;

            } else if (elementos[i].email === emailABuscar && elementos[i].contraseña !== passwordABuscar)
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

function buscarCoche()
{

}

window.addEventListener("load", iniciar);