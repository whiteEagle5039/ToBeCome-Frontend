import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "To be.come",
    short_name: "To be.come",
    description: "Explore. Choisis. Deviens.",
    start_url: "/onboarding/choix-profil",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F766E",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}