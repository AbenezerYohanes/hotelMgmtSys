import '../styles/globals.css'
import React from 'react'
import ToastProvider from '../../common/components/ToastProvider'

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
    </ToastProvider>
  )
}
