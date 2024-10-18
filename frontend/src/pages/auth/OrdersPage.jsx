import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TableBody, TableCell, TableHead, TableHeader, TableRow,Table } from '@/components/ui/table'
import { obtenerCompras } from '@/services/cartService'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronUp,  } from 'lucide-react'
import { useState } from 'react'

export default function OrdersPage() {

    const compras = useQuery({
        queryKey: ['compras'],
        queryFn: obtenerCompras,
        select: (data) => data.data,
        refetchOnWindowFocus: false,
    })

    const [expand, setExpand] = useState([])




    const toggleOrderExpansion = (compraId) => {
        setExpand(prev =>
            prev.includes(compraId)
                ? prev.filter(id => id !== compraId)
                : [...prev, compraId]
        )
    }


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (compras.isPending) return <div>Cargando... </div>

    console.log(compras.data.data)



    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Historial de compras</h1>
            {
                compras.data.data.length &&
                compras.data.data.map(compra => (
                    <Card key={compra.id} className="mb-4">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Compra #{compra.id}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleOrderExpansion(compra.id)}
                                >
                                    {expand.includes(compra.id) ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between mb-2">
                                <span>Date: {formatDate(compra.created_at)}</span>
                                <span className="font-semibold">Total: ${parseFloat(compra.total).toFixed(2)}</span>
                            </div>
                            {expand.includes(compra.id) && (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Producto</TableHead>
                                            <TableHead>Cantidad</TableHead>
                                            <TableHead>Precio</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            compra.products.length &&
                                            compra.products.map(product => {
                                                console.log(product)
                                                return (
                                                    <TableRow key={product.id}>
                                                        <TableCell className="flex items-center space-x-2">
                                                            <img
                                                                src={product.sprite}
                                                                alt={product.nombre}
                                                                className="w-8 h-8 object-contain"
                                                            />
                                                            <span className="capitalize">{product.nombre}</span>
                                                        </TableCell>
                                                        <TableCell>{product.pivot.quantity}</TableCell>
                                                        <TableCell>${parseFloat(product.precio).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                    </TableBody>
                                </Table>
                            )}
                            
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
}
