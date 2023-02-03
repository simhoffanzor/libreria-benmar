const catalogo = document.querySelector('.catalogo');
const carrito = document.querySelector('.carrito tbody');
const contenedorCarrito = document.querySelector('.carrito');
const tabla = document.querySelector('table');
const inputTarjeta = document.querySelector('.tarjeta');
const inputCVV = document.querySelector('.cvv');
const inputTitular = document.querySelector('.titular');
const inputFecha = document.querySelector('.fecha');
const inputMail = document.querySelector('.mail');
const btnSubmit = document.querySelector('.btn-comprar');
const btnCompletarCompra = document.querySelector('.btn-completar-compra');
const btnVaciar = document.querySelector('.vaciar-carrito');
const contenedorTexto = document.querySelector('.contenedor-texto');
const divContador = document.querySelector('.contador');
const infoCompra = {
    tarjeta: '',
    cvv: '',
    titular: '',
    fecha: '',
    mail: '',
};
let librosEnCarrito = [];
let nroObjetos = 0;

cargarEventListeners();
validarBtnCompletarCompra();
cargarContador(nroObjetos);

function validarBtnCompletarCompra(){
    if (librosEnCarrito.length === 0){
        btnCompletarCompra.classList.add('d-none');
        btnVaciar.classList.add('d-none');
        contenedorTexto.classList.remove('d-none');
    }else{
        contenedorTexto.classList.add('d-none');
        btnVaciar.classList.remove('d-none');
        btnCompletarCompra.classList.remove('d-none');
    }
}

function cargarContador(nroFinal){
    while(divContador.firstChild){
        divContador.removeChild(divContador.firstChild);
    }
    const contadorObjetos = document.createElement('div');
    contadorObjetos.innerHTML = `
        <button class="btn" style="border-radius:50px; background-color:white; margin-left:10px; margin-top:5px;">${nroFinal}</button>
    `
    divContador.appendChild(contadorObjetos);    
}

function cargarEventListeners(){
    catalogo.addEventListener('click', agregarAlCarrito);
    contenedorCarrito.addEventListener('click', botonesCarrito);
    inputTarjeta.addEventListener('blur', validarCampo);
    inputCVV.addEventListener('blur', validarCampo);
    inputTitular.addEventListener('blur', validarCampo);
    inputFecha.addEventListener('blur', validarCampo);
    inputMail.addEventListener('blur', validarCampo);
    btnSubmit.addEventListener('click', hacerCompra);
}

function agregarAlCarrito(e){
    if (e.target.classList.contains('agregar-carrito')){
        const libroAgregado = replicarLibro(e.target.parentElement.parentElement);
        
        if (librosEnCarrito.some(libro => libro.id === libroAgregado.id)){
            librosEnCarrito.forEach(libro => {
                if (libro.id === libroAgregado.id){
                    libro.cantidad ++;
                }
            })
        }else{
            librosEnCarrito = [...librosEnCarrito, libroAgregado];
        }
        validarBtnCompletarCompra();
        crearHTML();
        nroObjetos = nroObjetos + 1;
        cargarContador(nroObjetos);
    }
}

function replicarLibro(libro){
    const replicaLibro = {
        imagen: libro.querySelector('img').src,
        titulo: libro.querySelector('h5').textContent,
        autor: libro.querySelector('.autor').textContent,
        precio: libro.querySelector('.precio').textContent,
        cantidad: 1,
        id: libro.querySelector('.agregar-carrito').getAttribute('data-id'),
    }

    return replicaLibro;    
}

function crearHTML(){
    limpiarHTML();

    librosEnCarrito.forEach(libro => {
        const {imagen, titulo, autor, precio, cantidad, id} = libro;
        const filaLibro = document.createElement('TR');
        filaLibro.innerHTML = `
            <td class="tdImagen">
                <img src="${imagen}" alt="${titulo}" class="img-libro-carrito"/>
            </td>
            <td class="tdTitulo"><p class="txt-titulo">${titulo}</p></td>
            <td class="tdAutor"><p class="txt-autor">${autor}</p></td>
            <td class="tdPrecio"><p class="txt-precio">${precio}</p></td>
            <td><button class="btn disminuir-cant" style="" data-id="${id}">-</button>${cantidad}<button class="btn aumentar-cant" style="" data-id="${id}">+</button></td>
            <button class="btn btn-danger borrar-libro" data-id="${id}">X</button>
        `
        carrito.appendChild(filaLibro);
    })

    insertarTotal();
}

function crearFilaTotal(){
    const filaTotal = document.createElement('DIV');
    filaTotal.classList.add('filaTotal');
    filaTotal.innerHTML = `<p class="txt-total">Total de la compra: $${calcularTotal()}</p>`
    tabla.appendChild(filaTotal);
}
function insertarTotal(){
    const filaTotalExistente = tabla.querySelector('.filaTotal');
    if (filaTotalExistente || librosEnCarrito.length === 0){
        filaTotalExistente.remove();
    }    
    crearFilaTotal();
}
function limpiarHTML(){
    while (carrito.firstChild){
        carrito.removeChild(carrito.firstChild);
    }
}

function botonesCarrito(e){
    if (e.target.classList.contains('borrar-libro')){
        librosEnCarrito.forEach(libro => {
            if (e.target.getAttribute('data-id') === libro.id){
                nroObjetos = nroObjetos - libro.cantidad;
                cargarContador(nroObjetos);
            }
        })
        librosEnCarrito = librosEnCarrito.filter(libro => e.target.getAttribute('data-id') !== libro.id);
        crearHTML();
        validarBtnCompletarCompra();
    }else if (e.target.classList.contains('vaciar-carrito')){
        librosEnCarrito = [];
        nroObjetos = 0;
        cargarContador(nroObjetos);
        limpiarHTML();
        validarBtnCompletarCompra();
    }else if (e.target.classList.contains('disminuir-cant')){
        librosEnCarrito.forEach(libro => {
            if (e.target.getAttribute('data-id') === libro.id && libro.cantidad > 1){
                nroObjetos = nroObjetos - 1;
                cargarContador(nroObjetos);
                libro.cantidad = libro.cantidad - 1;
                crearHTML();
            }
        })
    }else if (e.target.classList.contains('aumentar-cant')){
        librosEnCarrito.forEach(libro => {
            if (e.target.getAttribute('data-id') === libro.id){
                libro.cantidad = libro.cantidad + 1;
                nroObjetos = nroObjetos + 1;
                cargarContador(nroObjetos);
                crearHTML();
            }
        })
    }
    insertarTotal();
}

function calcularTotal(){
    let listaPrecios = librosEnCarrito.map(libro =>{
        const precioNro = parseInt(libro.precio.slice(1),10);
        return precioNro * libro.cantidad;
    });
    let suma = 0;
    listaPrecios.forEach(precio=>{
        suma += precio;
    })
    return suma;
}

function validarCampo(e){
    if (e.target.value === ""){
        mostrarAlerta('* Este campo es obligatorio', e.target.parentElement);
        return;
    }

    if (e.target.id === 'mail'){
        if (!validarEmail(e.target.value)){
            mostrarAlerta('* El correo ingresado no es válido', e.target.parentElement);
            return;
        }
    }

    if (e.target.id === 'fecha'){
        if (!validarFecha(e.target.value)){
            mostrarAlerta('* La fecha es inválida. Por favor, utilice el formato MM/AA', e.target.parentElement);
            return;
        }
    }

    if (e.target.id === 'cvv'){
        if (!validarCVV(e.target.value)){
            mostrarAlerta('* El CVV consta de 3 dígitos', e.target.parentElement);
            return;
        }
    }

    if (e.target.id === 'tarjeta'){
        if (!validarTarjeta(e.target.value)){
            mostrarAlerta('* Verifique que introdujo los 16 dígitos correctamente', e.target.parentElement);
            return;
        }
    }

    infoCompra[e.target.id] = e.target.value;

    borrarAlerta(e.target.parentElement);
}

function mostrarAlerta(mensaje, referencia){
    borrarAlerta(referencia);

    const alerta = document.createElement('P');
    alerta.classList.add('msj-error');
    alerta.textContent = mensaje;
    referencia.appendChild(alerta);
}

function borrarAlerta(referencia){
    const alertaExistente = referencia.querySelector('.msj-error');

    if(alertaExistente){
        alertaExistente.remove();
    }
}

function validarEmail(email){
    const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ 
    const resultado = regex.test(email);
    return resultado;
}

function validarFecha(fecha){
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
    const resultado = regex.test(fecha);
    return resultado;
}

function validarCVV(cvv){
    const regex = /^[0-9]{3}$/
    const resultado = regex.test(cvv);
    return resultado;
}

function validarTarjeta(tarjeta){
    const regex = /^[0-9]{16}$/
    const resultado = regex.test(tarjeta);
    return resultado;
}

function hacerCompra(){
    if (infoCompra.titular === '' || infoCompra.cvv === '' || infoCompra.fecha === '' || infoCompra.tarjeta === ''){
        mostrarAlerta('* Debe llenar todos los campos para poder completar la compra', formulario)
    }else{
        infoCompra.cvv = '';
        infoCompra.fecha = '';
        infoCompra.mail = '';
        infoCompra.tarjeta = '';
        infoCompra.titular = '';

        const exito = document.createElement('P');
        exito.classList.add('msj-exito');
        exito.textContent = "¡La compra fue realizada exitosamente!";
        formulario.appendChild(exito);

        setTimeout(()=>{
            exito.classList.add('d-none');
        }, 3000)

        formulario.reset();
        librosEnCarrito = [];
        nroObjetos = 0;
        cargarContador(nroObjetos);
        limpiarHTML();
        validarBtnCompletarCompra();
    }
}