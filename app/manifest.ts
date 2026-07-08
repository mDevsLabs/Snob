import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snob - Édition Prestige',
    short_name: 'Snob',
    description: 'Un jeu de blocs de prestige ultra-fluide avec mode campagne, blitz frénétique, quêtes quotidiennes et boutique de skins légendaires !',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#020617',
    icons: [
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
