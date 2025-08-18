/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Exclude unnecessary directories from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  typescript: {
    // Only include relevant directories for type checking
    ignoreBuildErrors: false,
  },
  eslint: {
    // Only lint relevant directories
    dirs: ['app', 'lib', '__tests__'],
  },
}

module.exports = nextConfig