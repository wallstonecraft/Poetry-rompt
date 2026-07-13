/** @type {import('next').NextConfig} */
const nextConfig = {
  // The repo root also holds the design system's own reference components
  // (components/, ui_kits/, guidelines/) — source material to build against,
  // not part of this app, so only lint the actual app source.
  eslint: {
    dirs: ["src"],
  },
};

export default nextConfig;
