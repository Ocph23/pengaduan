import { useCookie } from "nuxt/app"

export default defineEventHandler(async (event) => {
    // The password must be at least 32 characters long
    const sessionConfig = { password: process.env.SESSION_PASSWORD as string }
   
})