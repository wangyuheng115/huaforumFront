//获取Django的数据
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NewButton from '../components/NewButton';

export default function Comment() {
    const [contents, setContent] = useState(null); // 初始化状态为null

    useEffect(() => {
        axios.get("http://192.168.1.148:8000/")
            .then((res) => {
                setContent(res.data);
            })
            .catch((err) => {
                console.error("获取数据失败:", err);
            });
            // 获取按钮元素
    const button = document.getElementById('NewButton');
    const button2 = document.getElementById('NewArticle');
    button2.style.display = 'none';
    // 设置初始状态
    let isRotated = false;

    // 添加点击事件监听器
    button.addEventListener('click', () => {
        // 切换按钮状态
        isRotated = !isRotated;

        // 根据状态设置旋转效果
        if (isRotated) {
            button.style.transform = 'rotate(135deg)';
            button2.style.animation = 'moveButton 0.3s ease-in-out forwards';
            button2.style.display = 'block';
        } else {
            button.style.transform = 'none';
            button2.style.animation = 'removeButton 0.3s ease-in-out forwards';
            //button2.style.display = 'none';
        }
    });
    }, [])

    //转换日期函数
    function convertDate(DateString) {
        const date = new Date(DateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要+1，并确保两位数格式
        const day = String(date.getDate()).padStart(2, '0'); // 确保两位数格式

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        //const seconds = String(date.getSeconds()).padStart(2, '0');
        //const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // 毫秒，但这可能不是必要的

        const formattedDate = `${year}年${month}月${day}日 ${hours}:${minutes}`;
        return formattedDate;
    }
    
    return (
        <>
            <NewButton />
            <div className="row">
                <div className="col-sm-12">
                    <form className="needs-validation" noValidate>
                        <div className="mb-3">
                            <label htmlFor="validationCustom01" className="form-label">评论内容</label>
                            <textarea className="form-control" name="content" id="validationCustom01" placeholder="最多不超过50字。" maxLength="50" title="请输入内容" required></textarea>
                            <div className="invalid-feedback">
                                请输入内容。
                            </div>
                        </div>
                        <div className="mb-3">
                            <button className="btn btn-danger" type="button" id="submit-comment">发送</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12">
                    <div className="list-group" >
                        <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100">
                            <div className="toast-container">
                                <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                    <div className="toast-body">
                                        <span id="rlsMessage"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="comment-list"></div>
                        {contents && contents.map((item, index) => (
                            <div key={index} className="list-group-item list-group-item-action">
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1">华友评论</h5>
                                    <small>{convertDate(item.created_at)}</small>
                                </div>
                                <p className="mb-1">{item.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
