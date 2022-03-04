if (!currentPath) { currentPath = window.location.pathname }

const isUserTweets = /(^\/users\/).+(\/tweets$)/.test(currentPath)
const isUserReplies = /(^\/users\/).+(\/replies$)/.test(currentPath)
const isUserLikes = /(^\/users\/).+(\/likes$)/.test(currentPath)
const userTabs = document.querySelectorAll('.user-tab')


if (isUserTweets) { userTabs[0].classList.add('active') }
if (isUserReplies) { userTabs[1].classList.add('active') }
if (isUserLikes) { userTabs[2].classList.add('active') }