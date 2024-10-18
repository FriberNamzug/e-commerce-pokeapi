import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { obtenerPokemones } from '@/services/Pokemones'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from './ui/card'
import { Skeleton } from './ui/skeleton'
import { Link } from 'react-router-dom'
import PATHS from '@/config/paths'

export default function Buscador() {


    const pokemones = useQuery({
        queryKey: ['pokemones', 10000],
        queryFn: () => obtenerPokemones({ limit: 10000 }),
        select: (data) => {
            const result = data.data.results.map((pokemon) => {
                return {
                    id: pokemon.url.split('/').filter(Boolean).pop(),
                    name: pokemon.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/').filter(Boolean).pop()}.png`,
                }
            })
            return { data: result }
        }
    })

    const [query, setQuery] = useState('')


    const [results, setResults] = useState([])


    const debouncedSearch = useDebouncedCallback((searchTerm) => {
        if (pokemones.data.data) {
            if (searchTerm.length >= 2) {
                const filtered = pokemones.data.data.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    pokemon.id === searchTerm
                )
                setResults(filtered)
            } else {
                setResults([])
            }
        }
    }, 300)



    useEffect(() => {
        debouncedSearch(query)
    }, [query, debouncedSearch])

    const handleClearSearch = () => {
        setQuery('')
        setResults([])
    }



    return (
        <div className="flex mb-8 flex-col">
            <div className="relative w-full">
                <Input
                    type="text"
                    placeholder="Buscar pokemon..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                />
                {query && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={handleClearSearch}
                    >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Limpiar Buscador</span>
                    </Button>
                )}
            </div>
            {(results.length > 0) && (
                <Card className="mt-2">
                    <CardContent className="p-2">
                        {pokemones.isPending && (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-12 w-full" />
                                ))}
                            </div>
                        )}


                        {!pokemones.isPending && !pokemones.isError && results.length > 0 && (
                            <>
                                <ul className="space-y-2">
                                    {results.slice(0, 5).map((pokemon) => (
                                        <Link
                                            to={`${PATHS.pokemon}/${pokemon.id}`}
                                            key={pokemon.id}
                                        >
                                            <li className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                                                <span className="font-medium">{pokemon.name}</span>
                                                <span className="text-sm text-gray-500">ID: {pokemon.id}</span>
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                                {results.length > 5 && (
                                    <p className="text-center py-2">
                                        Existen más resultados, se más especifico. ({results.length})
                                    </p>
                                )}
                            </>
                        )}

                        {query.length >= 2 && results.length === 0 && (
                            <p className="text-center py-2">No se encontraron resultados</p>
                        )}
                    </CardContent>
                </Card>
            )}

        </div>
    )
}
