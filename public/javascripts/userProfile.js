const userProfileControlPanel = document.querySelector('#user-profile-control-panel')

userProfileControlPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('#edit-user-button')) {
    const coverInput = document.querySelector('#cover-input')
    const deleteCoverBtn = document.querySelector('#delete-cover-btn')
    const avatarInput = document.querySelector('#avatar-input')
    // 如曾開啟edit-user-modal並選擇cover檔案
    if (coverInput.files.length !== 0) {
      // 清空coverInput的檔案
      coverInput.value = ''
      // 隱藏移除預覽按鈕
      deleteCoverBtn.classList.add('hide')
    }

    // 如曾開啟edit-user-modal並選擇avatar檔案
    if (avatarInput.files.length !== 0) {
      // 清空avatarInput的檔案
      avatarInput.value = ''
    }

    renderEditUserModal(event.target.dataset.userId)
  }
})

function renderEditUserModal(userId) {
  axios
  .get(`/api/users/${userId}`)
  .then((response) => {
    const user = response.data
    const coverWrapper = document.querySelector('#cover-wrapper')
    const avatarWrapper = document.querySelector('#avatar-wrapper')
    const formNameColumn = document.querySelector('#form-name-column')
    const formIntroColumn = document.querySelector('#form-intro-column')

    if (user.cover) {
      coverWrapper.innerHTML = `
        <img class="cover" id="current-cover" src="${ user.cover }" alt="">
      `
    } 
    if (user.avatar) {
      avatarWrapper.innerHTML =`
      <img class="avatar large" id="current-avatar" src="${ user.avatar }"></img>
      `
    }
    if (user.introduction) {
      formIntroColumn.innerHTML = `
    <label for="introduction">自我介紹</label>
    <textarea class="form-control" id="introduction" name="introduction"
    rows="3">${ user.introduction }</textarea>
    `
    }
    formNameColumn.innerHTML = `
      <label for="name">名稱</label>
      <input type="text" class="form-control" name="name" id="name" placeholder="Enter name" value="${user.name}" required>
    `
  })
  .catch(function (error) {
      console.log(error)
  })
}

