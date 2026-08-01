/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/checklist',
        destination: '/guias/checklist-previa-al-asado',
        permanent: true,
      },
      {
        source: '/diccionario',
        destination: '/guias/diccionario-parrillero',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
