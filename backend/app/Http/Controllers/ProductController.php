<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
{

    public function obtenerPrecioProductos(Request $request)
    {
        // Validar el array de IDs
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer', // Solo aseguramos que sean enteros
        ]);

        // Obtener los precios de los productos cuyo id_pokemon está en el array
        // Obtener los precios de los productos cuyo id_pokemon está en el array
        $productos = Product::whereIn('id_pokemon', $request->ids)
            ->get(['id_pokemon', 'precio']); // Solo seleccionamos los campos necesarios

        // Retornamos los productos encontrados. Si no hay productos, se retornará un array vacío.
        return response()->json($productos);
    }


}
