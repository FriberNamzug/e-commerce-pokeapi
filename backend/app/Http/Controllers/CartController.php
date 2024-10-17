<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CartController extends Controller
{

    public function obtenerCarrito(Request $request)
    {
        $user = $request->user();

        $cartItems = CartItem::where('id_usuario', $user->id)
            ->with('product') // Carga el producto relacionado
            ->get();

        return response()->json($cartItems);
    }

    public function agregarAlCarrito(Request $request)
    {

        $validatedData = $request->validate([
            'id_pokemon' => 'required|integer',
            'precio' => 'required|numeric',
        ]);

        //validamos si existe o no el producto, de no existir lo creamos 
        $producto = Product::where('id_pokemon', $validatedData['id_pokemon'])->first();


        if (!$producto) {
            $pokemonDetails = $this->obtenerDetallesPokemon($validatedData['id_pokemon']);
            // Verificar si se obtuvieron detalles del Pokémon
            if (empty($pokemonDetails)) return response()->json(['message' => 'El Pokémon no existe en la base de datos'], 404);
            // Crear el producto en la base de datos

            $producto = Product::create([
                'id_pokemon' => $validatedData['id_pokemon'],
                'nombre' => $pokemonDetails['name'],
                'precio' => $validatedData['precio'],
                'sprite' => $pokemonDetails['sprite'],
            ]);
        }


        $usuario = $request->user();

        $cartItem = CartItem::where('id_usuario', $usuario->id)
            ->where('id_producto', $producto->id)
            ->first();


        if ($cartItem) {
            // Si ya existe, aumentar la cantidad en 1
            $cartItem->cantidad += 1;
            $cartItem->save();
        } else {
            // Si no existe, crear un nuevo CartItem con cantidad 1
            CartItem::create([
                'id_usuario' => $usuario->id,
                'id_producto' => $producto->id,
                'cantidad' => 1 // Se inicializa con cantidad 1
            ]);
        }

        return response()->json(['message' => 'Producto agregado o actualizado en el carrito'], 200);
    }



    public function eliminarDelCarrito(Request $request)
    {
        // Validar que el id_producto sea un entero y exista en la tabla products
        $validatedData = $request->validate([
            'id_producto' => 'required|integer|exists:products,id', // validar que el producto exista
        ]);

        // Obtener el usuario autenticado
        $usuario = $request->user();

        // Verificar si el producto está en el carrito
        $cartItem = CartItem::where('id_usuario', $usuario->id)
            ->where('id_producto', $validatedData['id_producto'])
            ->first();

        if (!$cartItem) return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);

        if ($cartItem->cantidad > 1) {
            $cartItem->cantidad -= 1;
            $cartItem->save();
        } else {
            // Si la cantidad es 1, eliminar el producto del carrito
            $cartItem->delete();
        }

        return response()->json(['message' => 'Producto eliminado o cantidad reducida en el carrito'], 200);
    }


    public function eliminarProductoCompleto(Request $request)
    {
        // Validar que el id_producto sea un entero y exista en la tabla products
        $validatedData = $request->validate([
            'id_producto' => 'required|integer|exists:products,id', // validar que el producto exista
        ]);

        // Obtener el usuario autenticado
        $usuario = $request->user();

        // Buscar el producto en el carrito del usuario
        $cartItem = CartItem::where('id_usuario', $usuario->id)
            ->where('id_producto', $validatedData['id_producto'])
            ->first();

        if ($cartItem) {
            // Eliminar el producto completamente del carrito
            $cartItem->delete();

            return response()->json(['message' => 'Producto eliminado completamente del carrito'], 200);
        }

        return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);
    }



    public function vaciarCarrito(Request $request)
    {
        $usuario = $request->user();

        CartItem::where('id_usuario', $usuario->id)->delete();

        return response()->json(['message' => 'Carrito vaciado con éxito'], 200);
    }














    private function obtenerDetallesPokemon($id)
    {
        // Hacer una solicitud a PokeAPI para obtener los detalles del Pokémon
        $pokeapiData = Http::get("https://pokeapi.co/api/v2/pokemon/{$id}");

        // Verificar si la solicitud fue exitosa
        if (!$pokeapiData->successful()) return null;

        $pokemonDetails = $pokeapiData->json();

        // Devolver el sprite y tipos
        $types = array_map(function ($type) {
            return $type['type']['name']; // Solo guardar el nombre del tipo
        }, $pokemonDetails['types']);

        return [
            'name' => $pokemonDetails['name'], // Agregar el nombre del Pokémon
            'sprite' => $pokemonDetails['sprites']['front_default'], // Puedes ajustar esto para otros sprites si es necesario
            'types' => $types // Devolver los tipos
        ];
    }
}
