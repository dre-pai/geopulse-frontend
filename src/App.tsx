import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/AppShell'
import { ComparePage } from '@/pages/ComparePage'
import { CountryPage } from '@/pages/CountryPage'
import { ExplorePage } from '@/pages/ExplorePage'
import { HomePage } from '@/pages/HomePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="country/:countryRef" element={<CountryPage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
