import PropTypes from 'prop-types'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { agregarCarritoService } from '@/services/cartService'

import { add  } from '@/store/slice/cartSlice'
import { Loader2 } from 'lucide-react'
import { toast } from "sonner"



BotonesCarrito.propTypes = {
    id_pokemon: PropTypes.string.isRequired,
    precio: PropTypes.string.isRequired
}

export default function BotonesCarrito({ id_pokemon, precio }) {

    const { isAuthenticated } = useSelector(state => state.auth)
    const dispatch = useDispatch()


    const mutationAdd = useMutation({
        mutationFn: () => agregarCarritoService({
            precio: precio,
            id_pokemon: id_pokemon
        }),
        onSuccess: () => {
            dispatch(add({
                id_pokemon: id_pokemon,
                precio: precio,
                cantidad: 1
            }))
            toast.success('Agregado al carrito')
        },
        onError: (e) => {
            console.log(e)
            toast.error('Error al agregar al carrito')
        },
    })



    return (
        <div className='flex items-center w-full space-x-2'>

            <Button
                disabled={mutationAdd.isPending || !isAuthenticated}
                onClick={() => mutationAdd.mutate()}
                className="w-full"
            >
                {
                    mutationAdd.isPending ?
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Agregando...
                        </>
                        :
                        'Agregar al carrito'
                }
            </Button>
        </div>
    )
}
