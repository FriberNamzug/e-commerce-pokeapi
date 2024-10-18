import Buscador from '@/components/Buscador'
import Paginacion from '@/components/Paginacion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { obtenerPokemones, obtenerPokemon, obtenerPrecios } from '@/services/Pokemones'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSearchParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import BotonesCarrito from '@/components/BotonesCarrito'
import { useSelector } from 'react-redux'



export default function MainView() {

    const [searchParams] = useSearchParams()

    const limit = parseInt(searchParams.get('limit') || 20)
    const currentPage = parseInt(searchParams.get('page') || 1)

    const [offset, setOffset] = useState((currentPage - 1) * limit);


    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);



    const query = useQuery({
        queryKey: ['pokemones', currentPage, offset],
        queryFn: () => obtenerPokemones({ limit: limit, offset: offset }),
        select: (data) => {
            const result = data.data.results.map((pokemon) => {
                return {
                    id: pokemon.url.split('/').filter(Boolean).pop(),
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/').filter(Boolean).pop()}.png`,
                    price: Math.floor(Math.random() * (1000 - 100 + 1)) + 100
                }
            })
            return { data: result, count: data.data.count }
        }
    })


    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tienda Pokemon</h1>

            <Buscador />



            {
                (query.isSuccess && query.data) &&
                <Productos pokemones={query?.data?.data} />
            }

            {
                query.isPending &&
                <SekeletonProductos />
            }


            {
                query.isSuccess &&
                <div className="flex justify-center items-center space-x-2">
                    <Paginacion count={query?.data?.count} setOffset={setOffset} />
                </div>
            }

        </div>
    )
}



Productos.propTypes = {
    pokemones: PropTypes.array.isRequired
}


function Productos({ pokemones }) {

    const ids_pokemones = pokemones.map(pokemon => pokemon.id)

    const precioOriginal = useQuery({
        queryKey: ['precios_pokemones_ids', ids_pokemones],
        queryFn: () => obtenerPrecios({ ids_pokemon: ids_pokemones }),
        select: (data) => {
            const preciosMap = {};
            data.data.forEach(precio => {
                preciosMap[precio.id_pokemon] = precio.precio;
            });
            return preciosMap;
        },
        refetchOnWindowFocus: false,
    })


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {
                pokemones.map((pokemon, index) => {

                    const precioPokemon = precioOriginal.data?.[pokemon.id] || pokemon.price


                    return (
                        <CardProducto
                            key={index}
                            pokemon={pokemon}
                            precio={Number(precioPokemon)}
                        />
                    )
                })
            }
        </div>
    )

}



CardProducto.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
    }),
    precio: PropTypes.number.isRequired,
}



function CardProducto({ pokemon, precio }) {

    const pokemonDetails = useQuery({
        initialData: [],
        queryKey: ['type', pokemon.id],
        queryFn: () => obtenerPokemon({ id_pokemon: pokemon.id }),
        select: (data) => data.data
    })


    const isTrending = pokemon.price !== precio

    const { items } = useSelector(state => state.cart)

    const pokemonInCart = items.find(it => it.id_pokemon == pokemon.id)



    return (
        <Card className={`relative shadow-md transition-all duration-300 hover:shadow-lg ${isTrending ? 'border-primary border-2' : ''}`}>
            <CardHeader>
                <CardTitle className="text-lg font-bold truncate">{pokemon.name}</CardTitle>
                {
                    pokemonInCart &&
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold absolute top-2 right-2">
                        {pokemonInCart.cantidad}
                    </span>
                }
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-full h-48 object-cover mb-4"
                    />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    {
                        pokemonDetails.isSuccess && pokemonDetails.data?.types.map((type, index) => (
                            <Badge key={index} variant="secondary" className="capitalize">
                                {type.type.name}
                            </Badge>
                        ))
                    }
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${isTrending ? 'text-primary' : ''}`}>
                            ${precio.toFixed(2)}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {pokemon.id}</p>
                </div>
            </CardContent>
            <CardFooter>
                <BotonesCarrito
                    id_pokemon={pokemon.id}
                    precio={precio.toFixed(2)}
                />
            </CardFooter>
        </Card>
    )
}


function SekeletonProductos() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(8)].map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="w-full h-48 mb-4" />
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-16" />
                        </div>
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}