import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

import { Provider } from 'react-redux'
import store from '@/store/store'
import { Toaster } from "@/components/ui/sonner"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />

      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
