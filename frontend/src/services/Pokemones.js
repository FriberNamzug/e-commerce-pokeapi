import axios from 'axios'
import axiosInstance from '@/utils/axios'

const API_URL = import.meta.env.VITE_URL_POKEMON_API

export const obtenerPokemones = async ({
    offset = 0,
    limit = 20
}) => {
    const response = await axios.get(`${API_URL}/pokemon?offset=${offset}&limit=${limit}`)
    return response
}



export const obtenerPokemon = async ({ id_pokemon }) => {
    const response = await axios.get(`${API_URL}/pokemon/${id_pokemon}`)
    return response
}


export const obtenerPrecios = async ({ ids_pokemon }) => {
    const response = await axiosInstance.post(`/api/products/precios`, {
        ids: ids_pokemon
    })

    return response
}