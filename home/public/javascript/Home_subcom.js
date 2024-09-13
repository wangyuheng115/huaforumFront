$(document).ready(function () {
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        // 如果表单无效，阻止默认提交行为
        event.preventDefault();
        event.stopPropagation();
      }

      // 添加 'was-validated' 类，触发 Bootstrap 样式
      form.classList.add('was-validated');
    });
  });

  // 获取房间名
  //const roomName = JSON.parse(document.getElementById('room-name').textContent);

  // 根据roomName拼接websocket请求地址，建立长连接
  //  请求url地址为/ws/chat/<room_name>/
  const wss_protocol = (window.location.protocol == 'https:') ? 'wss://' : 'ws://';
  const chatSocket = new WebSocket(
    wss_protocol + '//localhost:8000' + '/ws/home/'
  );

  // 建立websocket连接时触发此方法，展示欢迎提示
  chatSocket.onopen = function (e) {
   /*  var commentHtml = '<div class="list-group-item list-group-item-action">';
        commentHtml += '<div class="d-flex w-100 justify-content-between">';
        commentHtml += '<h5 class="mb-1">华友圈</h5>';
        commentHtml += '<small></small>';
        commentHtml += '</div>';
        commentHtml += '<p class="mb-1">欢迎访问本站！🎉</p>';
        commentHtml += '</div>';
        $('#comment-list').append(commentHtml); */
  }

  // 从后台接收到数据时触发此方法
  // 接收到后台数据后对其解析，并加入到聊天记录chat-log
  const windowId = Math.random().toString(36).substr(2, 9);// 生成唯一标识符
  chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    var commentHtml = '<div class="list-group-item list-group-item-action">';
        commentHtml += '<div class="d-flex w-100 justify-content-between">';
        commentHtml += '<h5 class="mb-1">华友评论</h5>';
        commentHtml += '<small>'+data.time+'</small>';
        commentHtml += '</div>';
        commentHtml += '<p class="mb-1">'+data.content+'</p>';
        commentHtml += '</div>';
        if(data.sender == windowId){
            //commentHtml += '<div style="z-index: 10; left:50%; top:50%; transform: translate(-50%,-50%); position: fixed;" class="toast  fade hide" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="2000"><div class="toast-body">'+data.messagge+"</div></div><script>var myToast = document.querySelector('.toast');const toastBootstrap = bootstrap.Toast.getOrCreateInstance(myToast);toastBootstrap.show();</script>"
            var msg = document.getElementById('rlsMessage');
            msg.innerHTML=data.messagge;
            const toastLiveExample = document.getElementById('liveToast');
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
          }
        $('#comment-list').prepend(commentHtml);
  };

  // websocket连接断开时触发此方法
  chatSocket.onclose = function (e) {
    console.error('Comment socket closed unexpectedly');
  };

  $('#validationCustom01').on('keyup', function (e) {
    if (e.keyCode === 13) { // enter, return
      $('#submit-comment').click();
    }
  });

  // 每当点击发送消息按钮，通过websocket的send方法向后台发送信息。
  $('#submit-comment').on('click', function (e) {
    const commentInputDom = document.querySelector('#validationCustom01');
    const content = commentInputDom.value;
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(function (form) {
        if (content.trim() == '') {   
          form.classList.add('was-validated');
        }
    });
    if (content.trim() != '') {  
      //注意这里:先把文本数据转成json格式,然后调用send方法发送。
      chatSocket.send(JSON.stringify({
        'content': content,
        'sender': windowId
      }));
    }
    commentInputDom.value = '';
  });
});
