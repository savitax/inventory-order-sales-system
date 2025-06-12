import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from '../pages/Index/Index'
import OrderInfo from '../pages/OrderInfo/OrderInfo'
import Doubao from '../pages/Doubao/Doubao'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} >
                    <Route path='order' element={<OrderInfo />} />
                    <Route path='doubao' element={<Doubao />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
