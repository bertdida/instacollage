import Layout01 from './components/Layout01'

const images: string[] = [
  'https://images.unsplash.com/photo-1670141545540-7ffd026a6c74?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=736',
  'https://images.unsplash.com/photo-1542996416-2d720327bdd3?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
  'https://plus.unsplash.com/premium_photo-1668967516060-624b8a7021f4?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=687',
  'https://images.unsplash.com/photo-1602447468280-77fc96bd9285?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=735',
  'https://images.unsplash.com/photo-1603331651359-86dd9d0a92c2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170',
  'https://images.unsplash.com/photo-1507546602-311207b97bfa?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=627',
]

const App: React.FC = () => {
  return <Layout01 images={images} />
}

export default App
