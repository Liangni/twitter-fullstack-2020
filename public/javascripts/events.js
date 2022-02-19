//推文
const addTweet = document.querySelector('#description-modal')
const addButton = document.querySelector('#modal-post-button')

//推文
addTweet.addEventListener('input', function check(event) {
  if (addTweet.value.length < 1) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "內容不可為空白"
  }
  if (addTweet.value.length > 140) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "字數超過140字"
  }
  if (addTweet.value.length > 0 && addTweet.value.length < 140) {
    addTweet.classList.remove('is-invalid')
  }
})

//更改個人資料
addButton.addEventListener('click', function check(event) {
  if (addTweet.value.length < 1) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "內容不可為空白"
    event.preventDefault()
  }
  if (addTweet.value.length > 140) {
    addTweet.classList.add('is-invalid')
    addTweet.nextElementSibling.innerHTML = "字數超過140字"
    event.preventDefault()
  }
})

