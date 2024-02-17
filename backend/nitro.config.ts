//https://nitro.unjs.io/config
import path from "pathe";

export default defineNitroConfig({
  preset: "node",
  experimental: {
    openAPI: true,
  },
});
