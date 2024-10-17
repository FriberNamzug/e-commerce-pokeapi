<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $usuario = $request->validate([
                'email' => 'required|email|exists:users',
                'password' => 'required',
            ]);

            $user = User::where('email', $usuario['email'])->first();




            if (!$user || !Hash::check($usuario['password'], $user->password)) {
                return response()->json(['error' => 'Credenciales incorrectas'], 401);
            }

            $token = $user->createToken($user->email);


            return response()->json([
                "token" => $token->plainTextToken,
                "usuario" => [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function registro(Request $request)
    {
        try {
            $usuario = $request->validate([
                'name' => 'required|max:50',
                'password' => 'required|min:6|confirmed',
                'email' => 'required|email|unique:users'
            ]);

            $user = User::create($usuario);
            $token = $user->createToken($user->email);


            return [
                'token' => $token->plainTextToken,
                'usuario' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ];
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente'], 200);
    }
}
