import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Index from '../pages/Index/Index'
import OrderInfo from '../pages/OrderInfo/OrderInfo'
import Doubao from '../pages/Doubao/Doubao'
import Bzlr from '../pages/Bzlr/Bzlr'
import Bom from '../pages/Bom/Bom'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} >
                    <Route index element={<Navigate to="order" replace />} />
                    <Route path='order' element={<OrderInfo />} />
                    <Route path='doubao' element={<Doubao />} />
                    <Route path='bzlr' element={<Bzlr />} />
                    <Route path='bom' element={<Bom />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
