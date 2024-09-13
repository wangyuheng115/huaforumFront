import axios from 'axios';

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert('文件大小不能超过2MB');
        return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('请选择 JPG 或 PNG 格式的文件');
        return;
    }

    const formData = new FormData();

    formData.append('avatar', file);
    let token = localStorage.getItem('ysof_usertoken');
    axios.post('http://192.168.1.148:8000/user/useravatar/', formData,{
        headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        // 如果响应不是 200 OK，则抛出一个错误
        if (response.status !== 200) {
            throw new Error('上传失败');
        }
        // 从响应中获取 JSON 数据
        return response.data;
    })
    .then(data => {
        // 更新用户头像
        const userAvatar = document.getElementById('userAvatar');
        userAvatar.src = "http://192.168.1.148:8000"+data.avatarUrl;
        alert('头像上传成功');
        window.location.reload();
    })
    .catch(error => {
        console.error('头像上传失败:', error);
        alert('头像上传失败');
    });
}

export function openFilePicker() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = handleFileUpload;
    input.click();
}
