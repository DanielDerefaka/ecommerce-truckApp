

import autoCert from "anchor-pki/auto-cert/integrations/next";

const withAutoCert = autoCert({
  enabledEnv: "development",
});

const nextConfig = {
  images: {
    domains: [
      'uploadthing.com',
      'utfs.io',
      'img.clerk.com',
      'subdomain',
      'files.stripe.com',
    ],
  },
  reactStrictMode: false,


  typescript: {
    // Ignoring TypeScript errors during build
    ignoreBuildErrors: true,
  },

  eslint:{
    ignoreDuringBuilds: true
},


};

export default withAutoCert(nextConfig);
