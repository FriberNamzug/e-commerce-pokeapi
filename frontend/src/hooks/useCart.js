// src/hooks/useCart.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query'
import { initData } from '@/store/slice/cartSlice';
import { obtenerCarritoService } from '@/services/cartService'

const useCart = () => {
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.cart)

    const { data, isPending, isSuccess } = useQuery({
        queryKey: ['cart', items && items.map(item => item.id_pokemon), items && items.map(item => item.cantidad)],
        queryFn: obtenerCarritoService,
        refetchOnWindowFocus: false,
    })
    

    useEffect(() => {
        if (data && isSuccess) {
            const items = data.data.map(item => {
                return {
                    cantidad: item.cantidad,
                    id_pokemon: item.product?.id_pokemon,
                    id_producto: item.product?.id,
                }
            }) || []
            dispatch(initData(items));
        }
    }, [data, dispatch, isSuccess]);

    return {
        isPending,
    };
};

export default useCart;
