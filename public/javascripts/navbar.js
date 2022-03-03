const currentPath = window.location.pathname
const isTweetsPath = /^\/tweets/.test(currentPath)
const isUsersPath = /^\/users/.test(currentPath)
const navLinks = document.querySelectorAll('.nav-link')

if (isTweetsPath) { navLinks[0].classList.add('active') }
if (isUsersPath && !currentPath.includes('setting') ) { navLinks[1].classList.add('active') }
if (isUsersPath && currentPath.includes('setting')) { navLinks[2].classList.add('active') }