import App from './App.vue'
import AlbumsBlock from './components/AlbumsBlock.vue'
import ImagesBlock from './components/ImagesBlock.vue'

const routes = [
  {
    name: 'home',
    path: '/',
    component: App,
    children: [
      {
        name: 'all_albums',
        path: 'albums',
        component: AlbumsBlock,
      },
      {
        name: 'one_album',
        path: 'albums/:name', 
        component: ImagesBlock,
      },
    ],
  },
]

export default routes
