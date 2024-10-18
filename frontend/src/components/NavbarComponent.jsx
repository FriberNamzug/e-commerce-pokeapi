import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, LogIn, LogOut, ShoppingBag, ShoppingCart, User2 } from 'lucide-react'
import PATHS from '@/config/paths'
import { Link } from 'react-router-dom'
import RegistroForm from './forms/RegistroForm'
import LoginForm from './forms/LoginForm'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/slice/authSlice'
import useCart from '@/hooks/useCart'

export default function NavbarComponent() {

    const [isRegistroOpen, setIsRegistroOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    const { isAuthenticated } = useSelector(state => state.auth)
    const { items } = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const { isPending } = useCart()


    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to={PATHS.index}
                            className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-gray-800">Mi Tienda</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to={PATHS.orders}
                                    className="text-gray-600 hover:text-gray-900">
                                    <Button variant="ghost" className="flex items-center md:px-3 py-2 rounded-md text-sm font-medium">
                                        <ShoppingBag className="h-4 w-4" />
                                        <p className='hidden md:block md:ml-2'>
                                            Mis Compras
                                        </p>
                                    </Button>
                                </Link>
                                <Link
                                    to={PATHS.checkout}
                                    className="text-gray-600 hover:text-gray-900">
                                    <Button variant="ghost" className="flex items-center md:px-3 py-2 rounded-md text-sm font-medium">
                                        <ShoppingCart className="h-4 w-4" />
                                        <p className='hidden md:block md:ml-2'>
                                            Carrito
                                        </p>
                                        {isPending ? <Loader2 className='animate-spin h-4 w-4' />
                                            :
                                            <>
                                                {
                                                    items.length > 0 && (
                                                        <span className="ml-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                                            {items.reduce((acc, item) => acc + item.cantidad, 0)}
                                                        </span>
                                                    )
                                                }
                                            </>
                                        }
                                    </Button>
                                </Link>
                                <Button onClick={() => { dispatch(logout()) }} variant="ghost" className="md:ml-4">
                                    <LogOut className="h-4 w-4" />
                                    <p className='hidden md:block md:ml-2'>
                                        Cerrar Sesión
                                    </p>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={() => setIsRegistroOpen(true)}
                                    variant="ghost"
                                >
                                    <User2 className="mr-2 h-4 w-4" />
                                    Registrarse
                                </Button>
                                <Button
                                    onClick={() => setIsLoginOpen(true)}
                                    variant="ghost"
                                >
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Iniciar Sesión
                                </Button>
                                <RegistroForm setOpen={setIsRegistroOpen} open={isRegistroOpen} />
                                <LoginForm setOpen={setIsLoginOpen} open={isLoginOpen} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    )
}
