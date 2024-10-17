<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function comprarProductos(Request $request)
    {
        $usuario = $request->user();

        $cartItems = CartItem::where('id_usuario', $usuario->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 400);
        }

        $total = 0;

        // Calcular el total sumando el precio de cada producto multiplicado por la cantidad en el carrito
        foreach ($cartItems as $item) {
            $producto = Product::find($item->id_producto);

            if ($producto) {
                $total += $producto->precio * $item->cantidad;
            }
        }

        $order = Order::create([
            'id_usuario' => $usuario->id,
            'total' => $total
        ]);


        // Asociar los productos a la orden
        foreach ($cartItems as $item) {
            $order->products()->attach($item->id_producto, ['quantity' => $item->cantidad]);
        }



        #LIMPIAMOS EL CARRITO
        CartItem::where('id_usuario', $usuario->id)->delete();

        return response()->json([
            'message' => 'Compra realizada con éxito',
            'order_id' => $order->id,
            'total' => $total
        ], 200);
    }


    public function obtenerOrdenes(Request $request)
    {
        // Obtener el usuario autenticado
        $usuario = $request->user();

        $ordenes = Order::where('id_usuario', $usuario->id)
        ->with(['products:id,id_pokemon,nombre,precio,sprite']) // No es necesario incluir 'pivot'
        ->paginate(10); // 10 órdenes por página

        return response()->json($ordenes, 200);
    }
}
