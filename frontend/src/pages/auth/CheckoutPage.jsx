import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { finalizarCompra, limpiarCarritoService, obtenerCarritoService, quitarProductoCarritoService } from '@/services/cartService'
import { clear } from '@/store/slice/cartSlice'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export default function CheckoutPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { items } = useSelector(state => state.cart)

    const carrito = useQuery({
        queryKey: ['cart', items.map(item => item.id_pokemon), items.map(item => item.cantidad)],
        queryFn: obtenerCarritoService,
        select: (data) => data.data,
        refetchOnWindowFocus: false,
    })


    const mutationDelete = useMutation({
        mutationFn: (id_producto) => quitarProductoCarritoService({
            id_producto: id_producto
        }),
        onSuccess: (data, id_producto) => {
            console.log(id_producto)
            toast.success('Se quitó 1 unidad del carrito')
            carrito.refetch()
        },
        onError: (e) => {
            console.log(e)
            toast.error('Error al quitar el producto')
        },
    })


    const mutationClear = useMutation({
        mutationFn: () => limpiarCarritoService(),
        onSuccess: () => {
            toast.success('Se limpió el carrito')
            carrito.refetch()
            dispatch(clear())
        },
        onError: (e) => {
            console.log(e)
            toast.error('Error al quitar el producto')
        },
    })


    const mutationfini = useMutation({
        mutationFn: () => finalizarCompra(),
        onSuccess: () => {
            toast.success('Se finalizo la compra correctamente!')
            navigate('/a/orders', {
                replace: true
            })
            dispatch(clear())
        },
        onError: (e) => {
            console.log(e)
            toast.error('Error al quitar el producto')
        },
    })


    const getTotalPrice = () => {
        return carrito.data.reduce((total, item) => {
            return total + parseFloat(item.product.precio) * item.cantidad
        }, 0).toFixed(2)
    }






    if (carrito.isPending) return <p>Cargando...</p>


    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>
                        Tu carrito
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        carrito.data?.length === 0 ? (
                            <p className="text-center text-gray-500">
                                Tu carrito se encuentra vacio!
                            </p>
                        ) : (
                            <ul className="space-y-4">
                                {
                                    carrito.data.map((item) => (
                                        <li key={item.id} className="flex items-center space-x-4 py-2 border-b">
                                            <img src={item.product.sprite} alt={item.product.nombre} className="w-16 h-16 object-contain" />
                                            <div className="flex-grow">
                                                <h3 className="font-semibold capitalize">{item.product.nombre}</h3>
                                                <p className="text-sm text-gray-500">Cantidad: {item.cantidad}</p>
                                                <p className="font-medium">${parseFloat(item.product.precio).toFixed(2)}</p>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                disabled={mutationDelete.isPending}
                                                onClick={() => mutationDelete.mutate(item.product.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Eliminar {item.product.nombre} del carrito</span>
                                            </Button>
                                        </li>
                                    ))
                                }
                            </ul>
                        )}
                </CardContent>
                <CardFooter className="flex flex-col items-end space-y-4">
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total: ${getTotalPrice()}</p>
                    </div>
                    <div className='flex justify-between w-full'>
                        <Button
                            onClick={() => mutationClear.mutate()}
                            variant='destructive'
                            className="w-full sm:w-auto"
                            disabled={carrito.data.length === 0 || mutationClear.isPending}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Limpiar
                        </Button>
                        <Button
                            onClick={() => mutationfini.mutate()}
                            className="w-full sm:w-auto"
                            disabled={carrito.data.length === 0 || mutationfini.isPending || mutationClear.isPending || mutationDelete.isPending}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Comprar
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div >
    )
}
