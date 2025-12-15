import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './state/appState'
import Home from './pages/Home'
import Industry from './pages/Industry'
import Startups from './pages/Startups'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/insights" element={<Industry />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}
