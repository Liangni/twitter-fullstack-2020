const editUserModal = document.querySelector('#editUserModal')

editUserModal.addEventListener('change', function onFileChanged(event) {
  const fileInput = event.target

  if (fileInput.files.length !== 0) {
    if (fileInput.matches('#cover-input')) {
      showCoverPreview(fileInput)
    }
    if (fileInput.matches('#avatar-input')) {
      showAvatarPreview(fileInput)
    }
  }
})

editUserModal.addEventListener('click',
  function onModalClicked(event) {
    if (event.target.matches('#delete-cover-btn')) {
      deleteCoverPreview()
    }
  })

editUserModal.addEventListener('submit',
  function onUserFormSubmitted(event) {
    const saveUserInfoBtn = document.querySelector('#save-user-info-btn')
    event.preventDefault()
    showBtnLoader(saveUserInfoBtn)
    saveUserInfo(event.target.dataset.userId)
  }
)

function showCoverPreview(coverInput) {
  const coverWrapper = document.querySelector('#cover-wrapper')
  const currentCover = document.querySelector('#current-cover')
  const deleteCoverBtn = document.querySelector('#delete-cover-btn')
  const lastPreview = document.querySelector('#file-cover-preview') || null // 如抓不到節點表示未選取過檔案，帶入null值
  const newPreview = document.createElement('div')
  const src = URL.createObjectURL(coverInput.files[0])

  // 若是初次選擇檔案，要先隱藏使用者封面，並加上刪除按鈕
  if (!currentCover.classList.contains('hide')) {
    currentCover.classList.add('hide')
    deleteCoverBtn.classList.remove('hide')
  }
  //　若是重複選擇檔案，先把前一個選擇的圖片移除
  if (lastPreview) {
    lastPreview.remove()
  }

  newPreview.innerHTML = `
      <img src="${src}" class="cover" id="file-cover-preview">
    `
  coverWrapper.appendChild(newPreview)
}

function showAvatarPreview(avatarInput) {
  const avatarWrapper = document.querySelector('#avatar-wrapper')
  const currentAvatar = document.querySelector('#current-avatar')
  const lastPreview = document.querySelector('#file-avatar-preview') || null // 如抓不到節點表示未選取過檔案，帶入null值
  const newPreview = document.createElement('div')
  const src = URL.createObjectURL(avatarInput.files[0])

  // 若是初次選擇檔案，要先隱藏使用者頭貼
  if (!currentAvatar.classList.contains('hide')) {
    currentAvatar.classList.add('hide')
  }
  //　若是重複選擇檔案，要先把前一個選擇的圖片移除
  if (lastPreview) { lastPreview.remove() }

  newPreview.innerHTML = `
      <img src="${src}" class="avatar large" id="file-avatar-preview">
    `
  avatarWrapper.appendChild(newPreview)
}

function deleteCoverPreview() {
  const coverWrapper = document.querySelector('#cover-wrapper')
  const currentCover = document.querySelector('#current-cover')
  const deleteCoverBtn = document.querySelector('#delete-cover-btn')

  coverInput.value = ""
  coverWrapper.lastElementChild.remove()
  currentCover.classList.remove('hide')
  deleteCoverBtn.classList.add('hide')
}

function showBtnLoader(btn) {
  btn.disabled = true
  btn.innerHTML = 'Loading...'
}

function saveUserInfo(userId) {
  const userForm = document.querySelector('#user-form')
  const formData = new FormData(userForm)

  axios
    .post(`/api/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      if (response.data.status === 'success') {
        location.reload() 
      }
    })
    .catch((err)=> {
      console.log(err)
    })
}