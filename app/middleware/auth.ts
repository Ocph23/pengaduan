function isAuthenticated(): boolean {
    return true;
}
// ---cut---
export default defineNuxtRouteMiddleware(async (to, from) => {
    // isAuthenticated() is an example method verifying if a user is authenticated
    console.log("Test")
    if ( isAuthenticated() === false) {
        return navigateTo('/login')
    } else {
        return navigateTo('/admin')
    }
})
