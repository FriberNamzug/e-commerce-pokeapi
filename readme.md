### Configuracion de Docker-Compose
- **Levantar docker:** [CMD] docker-compose up -d --build
- **Servidor backend:** http://localhost:8001

### CONFIGURACION DE .env EN BACKEND

- DB_CONNECTION=pgsql
- DB_HOST=db
- DB_PORT=5432
- DB_DATABASE=pokeapi
- DB_USERNAME=postgres
- DB_PASSWORD=password

### Endpoints de Autenticación (AUTH)



#### Registro de un usuario
- **URL**: `{url-backend}/api/registro`
- **Método**: `POST`
- **JSON Request**:
  ```json
  {
    "name": "Roberto Friber",
    "email": "robertofriber@gmail.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Respuesta**:
  ```json
  {
    "token": "1|eliuxqDDAGezaQKtZuKOuhcYuXp4LJPAOguzN56Z0658991d",
    "usuario": {
      "id": 1,
      "name": "Roberto Friber",
      "email": "robertofriber@gmail.com"
    }
  }
  ```

#### Inicio de sesión de un usuario
- **URL**: `{url-backend}/api/login`
- **Método**: `POST`
- **JSON Request**:
  ```json
  {
    "email": "robertofriber@gmail.com",
    "password": "password1"
  }
  ```
- **Respuesta**:
  ```json
  {
    "token": "1|eliuxqDDAGezaQKtZuKOuhcYuXp4LJPAOguzN56Z0658991d",
    "usuario": {
      "id": 1,
      "name": "Roberto Friber",
      "email": "robertofriber@gmail.com"
    }
  }
  ```

#### Cerrar sesión
- **URL**: `{url-backend}/api/logout`
- **Método**: `POST`
- **Autorización**: `Bearer token`
- **Respuesta**:
  ```json
  {
    "message": "Sesión cerrada correctamente"
  }
  ```



### Endpoints de productos

#### Obtener precios de productos existentes
- **URL**: `{url-backend}/api/products/precios`
- **Método**: `GET`
- **JSON Request**:

  ```json
    {
    "ids": [1, 2, 3, 222]
    } (los ids tienen que ser de los pokemons en un array, solo devolverá los que tengan precios existentes en la base de datos)

  ```

- **Respuesta**:
  ```json
  [
      {
      "id_pokemon": 29,
      "precio": "123.00"
      }
      ...
  ]
  ```

### Endpoints del carrito

#### Agregar un pokemon al carrito
- **URL**: `{url-backend}/api/cart`
- **Método**: `POST`
- **Autorización**: `Bearer token`
- **JSON Request**:
  ```json
  {
    "id_pokemon": 29,
    "precio": 123
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Producto agregado o actualizado en el carrito"
  }
  ```

#### Eliminar o disminuir un producto del carrito
- **URL**: `{url-backend}/api/cart`
- **Método**: `DELETE`
- **Autorización**: `Bearer token`
- **JSON Request**:
  ```json
  {
    "id_producto": 48
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Producto eliminado o cantidad reducida en el carrito"
  }
  ```

#### Eliminar por completo un producto del carrito
- **URL**: `{url-backend}/api/cart/product`
- **Método**: `DELETE`
- **Autorización**: `Bearer token`
- **JSON Request**:
  ```json
  {
    "id_producto": 48
  }
  ```

#### Limpiar Carrito
- **URL**: `{url-backend}/api/cart/clear`
- **Método**: `DELETE`
- **Autorización**: `Bearer token`
- **JSON Request**:
  ```json
  {
    "id_producto": 48
  }
  ```

#### Obtener Carrito
- **URL**: `{url-backend}/api/cart`
- **Método**: `GET`
- **Autorización**: `Bearer token`
- **JSON Request**:
  ```json
  {
    "id_producto": 48
  }
  ```
- **Respuesta**:
  ```json
    [
        {
            "id": 1,
            "id_usuario": 1,
            "id_producto": 1,
            "cantidad": 1,
            "created_at": "2024-10-17T21:01:31.000000Z",
            "updated_at": "2024-10-17T21:01:31.000000Z",
            "product": {
                "id": 1,
                "id_pokemon": 29,
                "nombre": "nidoran-f",
                "precio": "123.00",
                "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                "created_at": "2024-10-17T21:01:31.000000Z",
                "updated_at": "2024-10-17T21:01:31.000000Z"
            }
        }
    ]
  ```

#### Finalizar carrito (simualcion de compra)
- **URL**: `{url-backend}/api/orders`
- **Método**: `GET`
- **Autorización**: `Bearer token`
- **Respuesta**:
  ```json
    {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "id_usuario": 1,
                "total": "123.00",
                "created_at": "2024-10-17T21:08:22.000000Z",
                "updated_at": "2024-10-17T21:08:22.000000Z",
                "products": [
                    {
                        "id": 1,
                        "id_pokemon": 29,
                        "nombre": "nidoran-f",
                        "precio": "123.00",
                        "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                        "pivot": {
                            "id_order": 1,
                            "id_product": 1,
                            "quantity": 1
                        }
                    }
                ]
            }
        ],
        "first_page_url": "http://localhost:8001/api/orders?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://localhost:8001/api/orders?page=1",
        "links": [
            {
                "url": null,
                "label": "pagination.previous",
                "active": false
            },
            {
                "url": "http://localhost:8001/api/orders?page=1",
                "label": "1",
                "active": true
            },
            {
                "url": null,
                "label": "pagination.next",
                "active": false
            }
        ],
        "next_page_url": null,
        "path": "http://localhost:8001/api/orders",
        "per_page": 10,
        "prev_page_url": null,
        "to": 1,
        "total": 1
    }
  ```

