import axiosInstance from "@/utils/axios";

export async function agregarCarritoService({
    id_pokemon,
    precio
}) {
    const response = await axiosInstance.post('/api/cart', {
        id_pokemon: id_pokemon,
        precio: precio
    })

    return response
}



export async function quitarProductoCarritoService({
    id_producto,
}) {
    const response = await axiosInstance.delete('/api/cart', {
        data: { id_producto: id_producto }, // Enviar el cuerpo aquí
    })

    return response
}


export async function limpiarCarritoService() {
    const response = await axiosInstance.delete('/api/cart/clear')
    return response
}





export async function obtenerCarritoService() {
    const response = await axiosInstance.get('/api/cart')
    return response
}



export async function finalizarCompra() {
    const response = await axiosInstance.post('/api/order')
    return response
}

export async function obtenerCompras() {
    const response = await axiosInstance.get('/api/orders')
    return response
}

