import { getUserInfo } from '../Function/User_tool.js';
import { useEffect, useState } from 'react';
import { openFilePicker } from '../Function/UpAvatar.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [originalUserInfo, setOriginalUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // 添加一个状态来控制编辑模式
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const data = await getUserInfo();
            if (!data) {
                // 如果用户信息为空，重定向到登录页面
                navigate('/NonLogged');
            } else {
                // 否则设置用户信息
                setUserInfo(data);
                setOriginalUserInfo(data);// 将初始用户信息保存在 originalUserInfo 中
            }
        }
        fetchData();
    }, [navigate]);

    // 取消编辑按钮点击事件处理函数
    const handleCancelEdit = () => {
        // 将输入框的值重置为原始值
        setUserInfo(originalUserInfo);
        // 切换编辑状态为 false
        setIsEditing(false);
    };

    //保存资料
    const saveProfile = (e) => {
        e.preventDefault();
        if(!userInfo.usernote){//如果note为空 取之前的值
            userInfo.usernote=originalUserInfo.usernote;
        }
        let token = localStorage.getItem('ysof_usertoken');
        axios.put("http://192.168.1.148:8000/user/saveprofile/", 
            {
                usernicname: userInfo.usernicname,
                usernote: userInfo.usernote,
                userbirthday: userInfo.userbirthday,
                usersex: userInfo.usersex,
                userwx: userInfo.userwx,
                userqq: userInfo.userqq,
                usernumber: userInfo.usernumber
            },{
                headers: {
                    'Authorization': 'JWT ' + token,
                    'Content-Type': 'application/json'
                }
            }
            )
            .then((res) => {
                //console.log(res);
                window.location.reload();
            })
            .catch((err) => { console.log(err) });
    };

    const imgStyle = {
        imgaeSize: 180,
    };
    return (
        <>
            {userInfo ?
                (
                    <form>
                        <div className="row">
                            <div className="col-3 text-center d-flex justify-content-center align-items-center border-end">
                                <div className="avatar position-relative" style={{ width: imgStyle.imgaeSize, height: imgStyle.imgaeSize }}>
                                    <div onClick={openFilePicker}>
                                        <img
                                            className="avatar"
                                            id='userAvatar'
                                            src={userInfo.useravatar ? ("http://192.168.1.148:8000" + userInfo.useravatar) : "./images/default.jpeg"}
                                            alt="用户头像"
                                            style={{ width: imgStyle.imgaeSize, height: imgStyle.imgaeSize }}
                                        />
                                        <p id='pAvatar' className="text-white position-absolute top-50 start-50 translate-middle" style={{ fontSize: '1rem', pointerEvents: 'none' }}>更换头像</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col d-flex align-items-end p-0">
                                <div className="flex-fill">
                                    <div className="row">
                                        <div className="col-1 d-flex align-items-center justify-content-end p-0">
                                            <i class="bi bi-file-text-fill" title='简介'></i>&nbsp;
                                        </div>
                                        <div className="col-10 p-0">
                                            <input className="form-control" type="text" readOnly={!isEditing} disabled={!isEditing} name="usernote" placeholder="请输入你的简介~" value={userInfo.usernote} onChange={(e) => setUserInfo({ ...userInfo, usernote: e.target.value })} aria-label="default input example" title='简介' />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-1 d-flex align-items-center justify-content-end p-0">
                                            <i class="bi bi-wechat" title='微信'></i>&nbsp;
                                        </div>
                                        <div className="col-5 p-0">
                                            <input className="form-control" type="text" readOnly={!isEditing} disabled={!isEditing} name="usernote" placeholder="请输入你的微信号" value={userInfo.userwx} onChange={(e) => setUserInfo({ ...userInfo, userwx: e.target.value })} aria-label="default input example" title='微信' />
                                        </div>
                                        <div className="col-1 d-flex align-items-center justify-content-end p-0">
                                            <i class="bi bi-tencent-qq" title='QQ'></i>&nbsp;
                                        </div>
                                        <div className="col-5 p-0">
                                            <input className="form-control" type="text" readOnly={!isEditing} disabled={!isEditing} name="usernote" placeholder="请输入你的QQ号" value={userInfo.userqq} onChange={(e) => setUserInfo({ ...userInfo, userqq: e.target.value })} aria-label="default input example" title='QQ' />
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-1 d-flex align-items-center justify-content-end p-0">
                                            <i class="bi bi-phone" title='手机号'></i>&nbsp;
                                        </div>
                                        <div className="col-10 p-0">
                                            <input className="form-control" type="text" readOnly={!isEditing} disabled={!isEditing} name="usernote" placeholder="请输入你的手机号" value={userInfo.usernumber} onChange={(e) => setUserInfo({ ...userInfo, usernumber: e.target.value })} aria-label="default input example" title='手机号' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 text-center border-end">
                                <h2>
                                    <input type="text" readOnly={!isEditing} disabled={!isEditing} class="form-control-plaintext text-center" id="usernicname" name="usernicname" value={userInfo.usernicname} onChange={(e) => setUserInfo({ ...userInfo, usernicname: e.target.value })} required />
                                </h2>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 d-flex align-items-center justify-content-center border-end">
                                <i class="bi bi-gender-ambiguous" title='性别'></i>
                                <select class="form-control-plaintext form-select-plaintext  text-center w-25 p-0" aria-label="Default select example" readOnly={!isEditing} disabled={!isEditing} value={userInfo.usersex} onChange={(e) => setUserInfo({ ...userInfo, usersex: e.target.value })} title='性别'>
                                    <option value="0">无</option>
                                    <option value="1">男</option>
                                    <option value="2">女</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 d-flex align-items-center justify-content-center border-end">
                                <i class="bi bi-cake" title='生日'></i>
                                <input className="form-control-plaintext text-center w-50 p-0" readOnly={!isEditing} disabled={!isEditing} type="date" name="userbirthday" title='生日' value={userInfo.userbirthday} onChange={(e) => setUserInfo({ ...userInfo, userbirthday: e.target.value })} />
                            </div>
                        </div>
                        <div className="row">

                            {
                                isEditing ? (
                                    <>
                                        <div className="col offset-9 text-center">
                                            <button type="button" class="btn btn-outline-secondary" onClick={handleCancelEdit} title='取消编辑'><i class="bi bi-x"></i> 取消编辑</button>
                                        </div>
                                        <div className="col ">
                                            <button type="submit" class="btn btn-danger" disabled={JSON.stringify(userInfo) === JSON.stringify(originalUserInfo)} onClick={saveProfile} title='保存'><i class="bi bi-check2-square"></i> 保存</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="col offset-10">
                                        <button type="button" class="btn btn-danger" onClick={() => setIsEditing(!isEditing)} title='点击开始编辑资料'><i class="bi bi-pencil-square"></i> 编辑资料</button>
                                    </div>
                                )
                            }
                        </div>
                    </form>
                ) : (
                    <form>
                        <div className="row">
                            <div className="col-3 text-center">
                                <img
                                    className="avatar"
                                    src="./images/default.jpeg"
                                    alt="用户头像"
                                    style={{ width: imgStyle.imgaeSize, height: imgStyle.imgaeSize }}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3 text-center">
                                <div class="spinner-grow spinner-grow-sm" role="status"></div>
                                <div class="spinner-grow spinner-grow-sm" role="status"></div>
                                <div class="spinner-grow spinner-grow-sm" role="status"></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col offset-10">
                                <button type="button" class="btn btn-danger" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>加载中...</button>
                            </div>
                        </div>
                    </form>
                )
            }
        </>
    )
}
