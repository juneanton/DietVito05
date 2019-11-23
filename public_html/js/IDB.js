/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global db */

var bd, cajadatos;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var database = null;
var usuario;

function iniciar() {

    //abre la conexion de la bd dietvito-05
    database = indexedDB.open("DietVito-05", 1);
    database.onupgradeneeded = function (e) {
        crearbd();
    };
    database.onsuccess = function (e) {
        alert('Database loaded');
        //Para que aparezcan directamente las actividades sin darle al boton (si preferimos eso en vez de pulsar para que aparezcan)
        //mostrarActividades();
        //LO HACE EN TODAS LAS PAGINAS Y SE RAYA SOLO LO TIENE QUE HACER EN ACTIVIDADES!!!!!
    };
    database.onerror = function (e) {
        alert('Error loading database');
    };

    if (document.getElementById("correo") === null) {

    } else {
        sesionStorage();
    }

    //HACER CON TODAS LAS PANTALLAS

    //----------------PANTALLA REGISTRAR USUARIO----------------
    if (document.title === "DietVito-Registrar Usuario") {
        //cajadatos = document.getElementById("cajadatos");
        alert("estamos en registro");
        correo = document.getElementById("correo");
        if (correo !== null)
            correo.addEventListener("input", comprobacionRegistro);

        contraseña = document.getElementById("contraseña");
        if (contraseña !== null)
            contraseña.addEventListener("input", comprobacionRegistro);

        nombre = document.getElementById("nombre");
        if (nombre !== null)
            nombre.addEventListener("input", comprobacionRegistro);

        pesoI = document.getElementById("peso");
        if (pesoI !== null)
            pesoI.addEventListener("input", comprobacionRegistro);

        altura = document.getElementById("altura");
        if (altura !== null)
            altura.addEventListener("input", comprobacionRegistro);

//        foto = document.getElementById("foto");
//        foto.addEventListener("input", comprobacionRegistro);
//
        var foto = document.getElementById("foto");
        foto.addEventListener("change", procesar);

        var botonRegistrarse = document.getElementById("registrarse");
        botonRegistrarse.addEventListener("click", add());

        var botonRegistrarse = document.getElementById("registrarse");
        botonRegistrarse.addEventListener("click", sesionStorage);
    }

    //----------------PANTALLA INICIAR SESION----------------
    else if (document.title === "DietVito-Iniciar sesión")
    {
        email = document.getElementById("correo");
        email.addEventListener("input", comprobacionLogin);

        contraseña = document.getElementById("contraseña");
        contraseña.addEventListener("input", comprobacionLogin);
        
        //CREO QUE VA ABAJO DONDE BUSCAREMAIL
        if (email === "diet@diet.eus" && comprobacionLogin) { //NO LO HACE
            //href = "Dietista.html";
            window.open("Dietista.html");
        } else { //NO LO HACE
            href = "Cliente.html";
        }
        
        var botonIniciarSesion = document.getElementById("btnIS");
        botonIniciarSesion.addEventListener("click", buscarEmail);
        
        var botonIniciarSesion = document.getElementById("btnIS");
        botonIniciarSesion.addEventListener("click", sessionStorage);

        
    }
    //----------------PANTALLA ACTIVIDADES----------------
    else if (document.title === "DietVito-Actividades")
    {
        //abre la conexion de la bd dietvito-05
        database = indexedDB.open("DietVito-05", 1);
        database.onupgradeneeded = function (e) {
            crearbd();
        };
        database.onsuccess = function (e) {
            alert('Database loaded');
            mostrarActividades();
        };
        database.onerror = function (e) {
            alert('Error loading database');
        };
    }
    //----------------PANTALLA REGISTRAR PESOS----------------
    else if (document.title === "DietVito-Registrar Peso") {
        //cajadatos = document.getElementById("cajadatos");
        alert("estamos en registro de pesos");
        correo = document.getElementById("correo");
        if (correo !== null)
            correo.addEventListener("input", comprobacionRegistroPeso);

        peso = document.getElementById("peso");
//        if (peso !== null)
//            peso.addEventListener("input", comprobacionRegistroPeso);

        fecha = document.getElementById("fecha");
//        if (fecha !== null)
//            fecha.addEventListener("input", comprobacionRegistroPeso);

        var botonRegistrarPeso = document.getElementById("enviarPeso");
        botonRegistrarPeso.addEventListener("click", addPeso());

        var botonRegistrarPeso = document.getElementById("enviarPeso");
        botonRegistrarPeso.addEventListener("click", sesionStorage);
    }
    //----------------PANTALLA REGISTRAR ACTIVIDADES----------------
    else if (document.title === "DietVito-Registrar Actividad") {


        //HACER
        //DESPLEGABLE ESTA SIN HACER 
        //desplegableActi();

        var botonRegistrarActi = document.getElementById("enviarActi");
        botonRegistrarActi.addEventListener("click", addActividad());

        var botonRegistrarActi = document.getElementById("enviarActi");
        botonRegistrarActi.addEventListener("click", sesionStorage);
    }

    //----------------PANTALLA CONSULTAR ACTIVIDADES----------------
//    else if (document.title === "DietVito-Consultar Actividad") {
//        
//        var botonAceptar = document.getElementById("enviar");
//        botonAceptar.addEventListener("click", comprobarFecha());
//    }
    //HAY QUE HACER LAS DEMAS VENTANAS
}

//----------------CREAR LA BD----------------
function crearbd() {
    var active = database.result;

    var almacen = active.createObjectStore("cliente", {keyPath: "email"});
    almacen.createIndex("porEmail", "email", {unique: true});
    almacen.add({email: "diet@diet.eus", contraseña: "diet2019"});

    var almacen1 = active.createObjectStore("actividades", {keyPath: "actividad"});
    almacen1.createIndex("porActividad", "actividad", {unique: true});

    almacen1.add({actividad: "Correr", descripcion: "Correr durante una hora", calorias: "500"});
    almacen1.add({actividad: "Nadar", descripcion: "Nadar durante una hora", calorias: "450"});
    almacen1.add({actividad: "Andar", descripcion: "Andar durante una hora", calorias: "200"});
    almacen1.add({actividad: "Basket", descripcion: "Basket durante una hora", calorias: "300"});
    almacen1.add({actividad: "Fútbol", descripcion: "Fútbol durante una hora", calorias: "350"});

    //----------------TABLA PESOS----------------
    var almacen2 = active.createObjectStore("pesoCliente", {keyPath: ["idUsuario", "fecha"]});
    almacen2.createIndex("porUsuario", ["idUsuario", "fecha"], {unique: true});

    //----------------TABLA REGISTRO ACTIVIDADES----------------
    var almacen3 = active.createObjectStore("actividadDiaria", {keyPath: ["idUsuario", "idActi", "fecha"]});
    almacen3.createIndex("porUsuario", ["idUsuario", "idActi", "fecha"], {unique: true});
}

//----------------REGISTRAR EL CLIENTE EN LA BD----------------
function add() {

    var active = database.result;
    //alert('ok' + active);
    var data = active.transaction(["cliente"], "readwrite");
    object = data.objectStore("cliente");

    //insert into
    var request = object.put({
        email: document.querySelector('#correo').value,
        contraseña: document.querySelector('#contraseña').value,
        nombre: document.querySelector('#nombre').value,
        peso: document.querySelector('#peso').value,
        altura: document.querySelector('#altura').value,
        foto: document.getElementById('foto').files[0].name

    });
    request.onerror = function (e) {
        alert(request.error.name + '\n\n' + request.error.message);
    };
    data.oncomplete = function (e) {
        //para que se borren los campos para poder registrar otro
        document.querySelector('#correo').value = '';
        document.querySelector('#contraseña').value = '';
        document.querySelector('#nombre').value = '';
        document.querySelector('#peso').value = '';
        document.querySelector('#altura').value = '';
        document.getElementById('foto').value = '';
        alert('se agrego correctamente el objeto');
    };
}

function addPeso() {
    //alert('1');
    var active = database.result;
    //alert('ok' + active);
    var data = active.transaction(["pesoCliente"], "readwrite");
    object = data.objectStore("pesoCliente");

    //insert into
    var request = object.put({
        idUsuario: document.querySelector('#correo').value,
        fecha: document.querySelector('#fecha').value,
        pesa: document.querySelector('#peso').value

    });
    request.onerror = function (e) {
        alert(request.error.name + '\n\n' + request.error.message);
    };
    data.oncomplete = function (e) {
        //para que se borren los campos para poder registrar otro
        document.querySelector('#correo').value = '';
        document.querySelector('#fecha').value = '';
        document.querySelector('#peso').value = '';
        alert('se agrego correctamente el objeto');
    };
}

function addActividad() {
    //HACER EL REGISTRO DE ACTIVIDAD CUANDO ESTE EL DESPLEGABLE HECHO
}

function sesionStorage()
{
    //--------------Session storage----------------------------
    if (sessionStorage.length === 0)
    {
        if (localStorage.length === 0)
        {
            document.getElementById("correo").innerHTML = "";
        } else
        {
            var datos = window.localStorage[ window.localStorage.length - 1];

            datos = JSON.parse(datos);

            document.getElementById("correo").innerHTML = 'Hola, ' + datos[0];
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

function comprobacionRegistro()
{
    comprobarEmail(email.value);
    comprobarContraseña(contraseña.value);
    comprobarNombre(nombre.value);
    comprobarPeso(pesoI.value);
    comprobarAltura(altura.value);
    comprobarFoto(foto.value);

    if (comprobarEmail(email.value) && comprobarContraseña(contraseña.value) && comprobarNombre(nombre.value)
            && comprobarPeso(pesoI.value) && comprobarAltura(altura.value) && comprobarFoto(foto.value))
    {
        return true;
    }
}

function comprobacionRegistroPeso() {
    comprobarEmail(email.vaule);
    //comprobarPeso(peso.value);
    //comprobarFecha(fecha.value);

    if (comprobarEmail(email.value)) //&& comprobarPeso(peso.value) && comprobarFecha(fecha.value))
    {
        return true;
    }
}

function desplegableActi() {
    //Recuperar la conexión que tenemos activa sobre nuestra bd
    var active = database.result;
    //Para lanzar instrucciones ->Una transacción SOLO PARA RECUPERAR, no podemos modificar datos
    var data = active.transaction(["actividades"], "readonly");
    //Sobre que almacen? SOLO EL NOMBRE DE LA ACTIVIDAD
    //------------------------------------------------------ DUDA DE SI KEYPATH O NO
    var object = data.objectStore("actividades.keyPath");
    //Donde almacenaremos los objetos que vayamos recorriendo para poder mostarlos luego
    var elements = [];
    //Recorrer los elementos del almacenamiento actividades --> Bucle
    //El cursor es como un puntero. Le decimos qeu se coloque a la entrada del almacen actividades para recorrerlo entero
    object.openCursor().onsuccess = function (e) {
        //El codigo que se va a ejecutar por cada uno de los objetos del almacen
        //Recuperar la info
        var result = e.target.result;
        //Si está vacío es porqeu hemos llegado al final del almacén -> SALIMOS
        if (result === null) {
            return;
        }
        //Para agregar el objeto al array que luego mostraremos
        elements.push(result.value);
        //Continuamos el bucle
        result.continue();
    };
    //Si la transacción ocurre correctamente
    data.oncomplete = function () {
        for (var key in elements) {
            var ejer = document.getElementById('opt');
            var option = document.createElement('option');
            //Duda de si es value, keys o lo que
            option.value = elements[key].result.keys();
            var optionText = document.createTextNode(elements[key].result.keys());
            option.appendChild(optionText);
            ejer.appendChild(option);
        }
    };
}

function mostrarActividades() {
    //Recuperar la conexión que tenemos activa sobre nuestra bd
    var active = database.result;
    //Para lanzar instrucciones ->Una transacción SOLO PARA RECUPERAR, no podemos modificar datos
    var data = active.transaction(["actividades"], "readonly");
    //Sobre que almacen? TODOS LOS OBJETOS DEL ALMACEN ACTIVIDADES
    var object = data.objectStore("actividades");
    //Donde almacenaremos los objetos que vayamos recorriendo para poder mostarlos luego
    var elements = [];

    //Recorrer los elementos del almacenamiento actividades --> Bucle
    //El cursor es como un puntero. Le decimos qeu se coloque a la entrada
    //del almacen actividades para recorrerlo entero
    object.openCursor().onsuccess = function (e) {
        //El codigo que se va a ejecutar por cada uno de los objetos del almacen
        //Recuperar la info
        var result = e.target.result;
        //Si está vacío es porqeu hemos llegado al final del almacén -> SALIMOS
        if (result === null) {
            return;
        }
        //Para agregar el objeto al array que luego mostraremos
        elements.push(result.value);
        //Continuamos el bucle
        result.continue();
    };
    //Si la transacción ocurre correctamente
    data.oncomplete = function () {
        //Generear el contenido HTML que tenemos qeu insertar en el tbody desde el array
        var outerHTML = ''; //Cadena vacía

        //Por cada elemento del array
        for (var key in elements) {
            //Incorporarle una
            outerHTML += '\n\
            <tr>\n\
                <td>' + elements[key].actividad + '</td>\n\
                <td>' + elements[key].descripcion + '</td>\n\
                <td>' + elements[key].calorias + '</td>\n\
            </tr>';
        }

        //Vaciamos elements
        elements = [];
        //Para que a elementsList le asigne el valor de outerHTML
        document.querySelector('#elementsList').innerHTML = outerHTML;
    };
}

function procesar(evento) { //NOSE QUE ES NI QUE HACE

    cajadatos.innerHTML = "";
    var archivos = evento.target.files;
    var archivo = archivos[0];
    var lector = new FileReader();
    lector.addEventListener("load", function (evento) {
        mostrar(evento, archivo);
    });
    lector.readAsBinaryString(archivo);
}

//function mostrar(archivo) {
//
//    var url = URL.createObjectURL(archivo);
//    var imagen = document.createElement("img");
//    imagen.src = url;
//    cajadatos.appendChild(imagen);
//
//}

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

function comprobarFecha()
{
        fechaI = document.getElementById("fechaI").value;
        fechaF = document.getElementById("fechaF").value;
        
        if (fechaI <= fechaF) {
            alert('fecha bien introducida');
            return true;
        } else {
            alert('fechaI no puede ser mayor que fechaF');
        }
}

//----------------VERIFICA EL LOGIN Y HACE EL HOLA NOSEQUIEN----------------
function buscarEmail()
{
    alert('buscando el email');
    var emailABuscar = document.getElementById("correo").value;
    var contraseñaABuscar = document.getElementById("contraseña").value;

    //----------- CONECTAR A LA BD ----------------  
    var active = database.result;
    var transaccion = active.transaction(["cliente"], "readonly");
    var almacen = transaccion.objectStore("cliente");
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

                usuario = elementos[i].nombre;

                holaU = document.getElementById("correo").innerHTML = 'Hola, ' + usuario;

                //CAMBIA DE PAGINA SEGUN SEA CLIENTE O DIETISTA
                if (clave === "diet@diet.eus") {
                    alert('diet');
                    location.href = "Dietista.html";
                } else {
                    alert('hola, '+usuario);
                    location.href = "Cliente.html";
                }

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
function saludarUsuario(){
    //return document.getElementById("correo").innerHTML = 'Hola, ' + usuario;
    return usuario;
    alert('saluda');
};
function buscarFotoUsuario(){
    //COMO BUSCO LA FOTOOO????????????
};

//---------------BUSCA EL USUARIO EN LA BD PARA MOSTRAR SUS REGISTROS--------
function buscarEmailParaVerDatos(){
    var emailABuscar = document.getElementById("correo").value;
    
     //----------- CONECTAR A LA BD ----------------  
    var active = database.result;
    var transaccion = active.transaction(["cliente"], "readonly");
    var almacen = transaccion.objectStore("cliente");
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
        //Recorremos todos
        while (i < elementos.length && !encontrado)
        {
            //Sie ecnontramos el usuario
            if (elementos[i].email === emailABuscar) {
                alert("Usuario encontrado!!!!");
                
            }
            else i++;
        }
        if(!encontrado) {
            alert("Usuario no encontrado");
        }
    }
    
    
}

//----------------CERRAR SESION----------------
function cerrarSesion() {
    alert("cierra sesion");
    sessionStorage.clear();
    localStorage.clear();
}

window.addEventListener("load", iniciar);
