import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { obtenerPokemon } from '@/services/Pokemones'
import { useQueries } from '@tanstack/react-query'
import { ArrowLeft, Badge } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

export default function PokemonPage() {
    const { id } = useParams()
    const navigation = useNavigate()
    const precioRandom = Math.floor(Math.random() * (1000 - 100 + 1)) + 100

    useEffect(() => {
        if (!id || isNaN(id)) navigation('/')
    }, [id, navigation])


    const [pokemon] = useQueries({
        queries: [
            {
                queryKey: ['pokemones', 10000],
                queryFn: () => obtenerPokemon({ id_pokemon: id }),
                select: (data) => ({
                    name: data.data.name,
                    id: data.data.id,
                    image: data.data.sprites.front_default,
                    types: data.data.types.map((type) => type.type.name),
                })
            },
        ]
    })

    if (pokemon.isPending) return <div>Cargando...</div>


    return (
        <div className="flex justify-center items-center min-h-screen">
            {
                pokemon.isSuccess &&
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span className="capitalize">{pokemon.data.name}</span>
                            <span className="text-sm text-muted-foreground">#{pokemon.data.id}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center space-y-4">
                            <img src={pokemon.data.image} alt={pokemon.data.name} className="w-48 h-48 object-contain" />
                            <div className="flex gap-2">
                                {pokemon.data.types.map((type) => (
                                    <Badge key={type} variant="secondary" className="capitalize">
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-2xl font-bold">
                                $ {precioRandom.toFixed(2)}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button
                            variant="outline"
                            onClick={() => navigation(-1)}
                            className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Back
                        </Button>
                    </CardFooter>
                </Card>
            }
        </div>

    )
}
