/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global db */

var bd, cajadatos;
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var database = null; //MIO

function iniciar() {

    //abre la conexion de la bd dietvito-05
    database = indexedDB.open("DietVito-05", 1);
    database.onupgradeneeded = function (e) {//MIO
        crearbd();
    };
    database.onsuccess = function (e) {//MIO
        alert('Database loaded');
        //Para que aparezcan directamente las actividades sin darle al boton (si preferimos eso en vez de pulsar para que aparezcan)
        mostrarActividades();
        //LO HACE EN TODAS LAS PAGINAS Y SE RAYA SOLO LO TIENE QUE HACER EN ACTIVIDADES!!!!!
    };
    database.onerror = function (e) { //MIO
        alert('Error loading database');
    };
  
    if (document.getElementById("correo") === null) {

    } 
    else {
        sesionStorage();
    }
    
    //HACER CON TODAS LAS PANTALLAS
    
    //----------------PANTALLA REGISTRAR USUARIO---------------- (SIN HACER)
    if (document.title === "DietVito-Registrar Usuario") {
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
    
    //----------------PANTALLA INICIAR SESION----------------
    else if (document.title === "DietVito-Iniciar sesión") //YO
    {        
        email = document.getElementById("correo");
        email.addEventListener("input", comprobacionLogin);
        
        contraseña = document.getElementById("contraseña");
        contraseña.addEventListener("input", comprobacionLogin);
        
        var botonIniciarSesion = document.getElementById("btnIS");
        botonIniciarSesion.addEventListener("click", buscarEmail);
        
        var botonIniciarSesion = document.getElementById("btnIS");
        botonIniciarSesion.addEventListener("click", sessionStorage);
        
        if(buscarEmail(email) === "diet@diet.eus"){ //NO LO HACE
            href = "Dietista.html";
        }
        else{ //NO LO HACE
            href = "Cliente.html";
        }
    } 
    //HAY QUE HACER LAS DEMAS VENTANAS
}

//----------------CREAR LA BD----------------
function crearbd() {
    var active = database.result;

    var almacen = active.createObjectStore("cliente", {keyPath: "email"});
    almacen.createIndex("porEmail", "email", {unique: true});

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
function add() { //MIO
    //alert('1');
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
        document.getElementById('foto').files[0].name;
        alert('se agrego correctamente el objeto');
    };
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
    } 
    else
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
//----------------REGISTRA A LOS USUARIOS---------------- ESTE LO COMPRUEBA EL NUESTRO NO! CAMBIAR
function agregarClientes() {
    alert("agregar clientes");
    if (comprobacionRegistro() === true)
    {
        var transaccion = bd.transaction(["usuarios"], "readwrite");
        var almacen = transaccion.objectStore("usuarios");

        var email = document.getElementById("email").value;
        var contraseña = document.getElementById("contraseña").value;
        var nombre = document.getElementById("nombre").value;
        var pesoI = document.getElementById("pesoInicial").value;
        var altura = document.getElementById("altura").value;
        var foto = document.getElementById("foto").value;

        var consulta = almacen.openCursor(email);
        consulta.onsuccess = function (e)
        {
            var cursor = e.target.result;
            if (cursor)
            { // el email ya existe
                alert("Ya existe ese usuario!");
            } else
            {
                almacen.add({email: email, contraseña: contraseña, nombre: nombre, pesoInicial: pesoI, altura: altura, foto: foto});
                alert("Se ha insertado correctamente");
                var datos = new Array(); //Creamos un nuevo array vacío
                datos[0] = nombre;
                datos[1] = email;
                datos[2] = contraseña;
                datos[3] = pesoInicial;
                datos[4] = altura;
                datos[5] = foto;
                //en sessionStorage cuando cierras la pestaña no se guarda la info
                window.sessionStorage[ window.sessionStorage.length ] = JSON.stringify(datos);
                //en localStorage cuando cierras la pestaña si se guarda la info
                window.localStorage[ window.localStorage.length ] = JSON.stringify(datos);
            };
        };
    } else {
        alert("Introduce los datos correctamente");
    }
}
function comprobacionRegistro() //CAMBIAR
{
    comprobarEmail(email.value);
    comprobarContraseña(contraseña.value);
    comprobarNombre(nombre.value);
    comprobarPeso(pesoI.value);
    comprobarAltura(altura.value);
    comprobarFoto(foto.value);

    if (comprobarEmail(email.value) && comprobarContraseña(contraseña.value) && comprobarNombre(nombre.value)
          && comprobarPeso(pesoI.value) &&  comprobarAltura(altura.value) && comprobarFoto(foto.value))
    {
        return true;
    }
}

function desplegableActi () {
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
    object.openCursor().onsuccess= function(e){
        //El codigo que se va a ejecutar por cada uno de los objetos del almacen
        //Recuperar la info
        var result = e.target.result;
        //Si está vacío es porqeu hemos llegado al final del almacén -> SALIMOS
        if(result === null){
            return;
        }
        //Para agregar el objeto al array que luego mostraremos
        elements.push(result.value);
        //Continuamos el bucle
        result.continue();
    }; 
    //Si la transacción ocurre correctamente
    data.oncomplete = function(){
        //Generear el contenido HTML que tenemos qeu insertar en el tbody desde el array
        var outerHTML = ''; //Cadena vacía
        
        //BUSCARCOCHE EMAIL MIRAAAAR
        
        //Por cada elemento del array
        for(var key in elements) {
            //Incorporarle una
            outerHTML += '\n\
            <tr>\n\
                <td>' +elements[key].actividad + '</td>\n\
                <td>' +elements[key].descripcion + '</td>\n\
                <td>' +elements[key].calorias + '</td>\n\
            </tr>';    
        }
        
        //Vaciamos elements
        elements = [];
        //Para que a elementsList le asigne el valor de outerHTML
        document.querySelector('#elementsList').innerHTML = outerHTML;
    };
}

function mostrarActividades(){
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
    object.openCursor().onsuccess= function(e){
        //El codigo que se va a ejecutar por cada uno de los objetos del almacen
        //Recuperar la info
        var result = e.target.result;
        //Si está vacío es porqeu hemos llegado al final del almacén -> SALIMOS
        if(result === null){
            return;
        }
        //Para agregar el objeto al array que luego mostraremos
        elements.push(result.value);
        //Continuamos el bucle
        result.continue();
    }; 
    //Si la transacción ocurre correctamente
    data.oncomplete = function(){
        //Generear el contenido HTML que tenemos qeu insertar en el tbody desde el array
        var outerHTML = ''; //Cadena vacía
        
        //Por cada elemento del array
        for(var key in elements) {
            //Incorporarle una
            outerHTML += '\n\
            <tr>\n\
                <td>' +elements[key].actividad + '</td>\n\
                <td>' +elements[key].descripcion + '</td>\n\
                <td>' +elements[key].calorias + '</td>\n\
            </tr>';    
        }
        
        //Vaciamos elements
        elements = [];
        //Para que a elementsList le asigne el valor de outerHTML
        document.querySelector('#elementsList').innerHTML = outerHTML;
    };
}

//SUPER ADI!!! Cuando vayamos a registrar una nueva actividad tendremos que poner mostrarActividades() para que visualice de nuevo con la nueva
//actividad agregada

//CAMBIO: Este método para cuando agregemos actividades que hemos reaizado
function agregarActividades(){

};

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

function mostrar(archivo) {

    var url = URL.createObjectURL(archivo);
    var imagen = document.createElement("img");
    imagen.src = url;
    cajadatos.appendChild(imagen);

}

function comprobacionLogin() //BIEN
{
    comprobarEmail(email.value);
    comprobarContraseña(contraseña.value);
}

function comprobarEmail(pEmail) //BIEN
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

function comprobarContraseña(pContraseña) //BIEN
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
function buscarEmail() //BIEN
{
    alert ('buscando el email');
    var emailABuscar = document.getElementById("correo").value;
    var contraseñaABuscar = document.getElementById("contraseña").value;

    //----------- CONECTAR A LA BD ----------------   
    var transaccion = bd.transaction(["cliente"], "readonly");
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

                var usuario = elementos[i].nombre;

                holaU = document.getElementById("correo").innerHTML = 'Hola, ' + usuario;

            } 
            else if (elementos[i].email === emailABuscar && elementos[i].contraseña !== contraseñaABuscar)
            {
                alert("Contraseña incorrecta!!!!");
                encontrado = true;
            } 
            else
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
