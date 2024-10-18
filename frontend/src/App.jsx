import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PATHS from '@/config/paths'
import MainView from "./pages/MainView";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorComponent from "./components/ErrorComponent";
import Layout from "./components/Layout";
import AuthComponent from "./components/AuthComponent";
import CheckoutPage from "./pages/auth/CheckoutPage";
import OrdersPage from "./pages/auth/OrdersPage";
import PokemonPage from "./pages/PokemonPage";
function App() {




  const router = createBrowserRouter([
    {
      path: PATHS.index,
      element: <Layout />,
      errorElement: <ErrorComponent />,
      children: [
        {
          index: true,
          element: (
            <MainView />
          ),
        },
        {
          path: `${PATHS.pokemon}/:id`,
          element: <PokemonPage />
        },
        //AUTH
        {
          path: '/a/',
          element: <AuthComponent />,
          children: [
            {
              element: <OrdersPage />,
              path: PATHS.orders
            },
            {
              element: <CheckoutPage />,
              path: PATHS.checkout
            }
          ]
        },
        {
          path: '*',
          element: (
            <NotFoundPage />
          )
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
