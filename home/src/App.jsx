import './App.css';
//Bootstrap

import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap'
//Components 
import Header from './components/Header';
import Footer from './components/Footer';
//Route 
import { NavLink, useRoutes } from 'react-router-dom';
import routes from './routes';
//获取Django的数据
import axios from 'axios';
import React, { useEffect, useState } from 'react';
//引入保存登录用的token的函数
import {saveTokenToLocalStorage} from './Function/Save_token.js'
//获取用户信息
import { getUserInfo } from './Function/User_tool.js';

function App() {
  const [user, setUser] = useState({
        usernicname: '',
        username: '',
        password:'',
  }); // 初始化状态为null
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
        const data = await getUserInfo();
        setUserInfo(data);
    }
    fetchData();
}, []);

  //输入数据
  const handleInput = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  //发送数据
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://192.168.1.148:8000/user/", {
        usernicname: user.usernicname,
        username: user.username,
        password:user.password,
      })
      .then((res) => {
        // 注册成功后立即登录
        loginAfterSign({
          username: user.username,
          password: user.password,
        });
        setUser({
          usernicname: "",
          username: "",
          password:"",
        });
      })
      .catch((err) => {console.log(err)});
  };
  const loginSubmit = (e) => {
    e.preventDefault();

    axios.post("http://192.168.1.148:8000/user/login/", {
        username: user.username,
        password:user.password,
      })
      .then((res) => {
        //保存jwt token 到localStorage中
        saveTokenToLocalStorage(res.data.token);
        window.location.reload();
        //console.log(res.data.token);
        /*setUser({
          username: "",
          password:"",
        });*/
      })
      .catch((err) => {console.log(err)});
  };

  const loginAfterSign = (userData) => {
    axios.post("http://192.168.1.148:8000/user/login/", {
        username: user.username,
        password:user.password,
      })
      .then((res) => {
        //保存jwt token 到localStorage中
        saveTokenToLocalStorage(res.data.token);
        window.location.reload();
      })
      .catch((err) => {console.log(err)});
  };

  //根据路由表生成对应的路由规则 
  const elements = useRoutes(routes)

  function computedClassName({ isActive }) {
    return isActive ? 'flex-sm-fill text-sm-center nav-link active' : 'flex-sm-fill text-sm-center nav-link'
  }
  return (
    <>
    <div className="container d-flex flex-column h-100">
        {/* Modal login */}
        <div className="modal fade" tabIndex="-1" id="modalSignin" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header p-5 pb-4 border-bottom-0">
                <h1 className="fw-bold mb-0 fs-2"><img src="./favicon.ico" alt="Logo" height="40px" width="40px" /> 华友圈</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-5 pt-0">
                <form className="" onSubmit={loginSubmit}>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control rounded-3" id="floatingInput" placeholder="name@example.com" name='username' value={user.username} onChange={handleInput} required/>
                    <label htmlFor="floatingInput">账号</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input type="password" className="form-control rounded-3" id="floatingPassword" placeholder="Password" name='password' value={user.password} onChange={handleInput} required/>
                    <label htmlFor="floatingPassword">密码</label>
                  </div>
                  <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">立即登录</button>
                  <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" data-bs-toggle="modal" data-bs-target="#modalSignin2" type='button'>前往注册</button>
                  <small className="text-body-secondary">单击“注册”即表示您同意使用条款。</small>
                  <hr className="my-4" />
                  <h2 className="fs-5 fw-bold mb-3">使用第三方登录</h2>
                  <button className="w-100 py-2 mb-2 btn btn-outline-primary rounded-3" type="submit">
                    <i className="bi bi-tencent-qq"></i>
                    使用腾讯QQ登录
                  </button>
                  <button className="w-100 py-2 mb-2 btn btn-outline-success rounded-3" type="submit">
                    <i className="bi bi-wechat"></i>
                    使用微信登录
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Modal sigin */}
        <div className="modal fade" tabIndex="-1" id="modalSignin2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" data-bs-backdrop="static">
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header p-5 pb-4 border-bottom-0">
                <a href='/' className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" data-bs-toggle="modal" data-bs-target="#modalSignin"><i className="bi bi-arrow-left"></i>返回</a>
                <div className='px-3'></div>
                <h1 className="fw-bold mb-0 fs-2"><img src="./favicon.ico" alt="Logo" height="40px" width="40px" /> 注册账号</h1>

                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-5 pt-0">
                <form className="row g-3 needs-validation" onSubmit={handleSubmit} noValidate>
                  <div className="col-md-12">
                    <label htmlFor="validationCustom02" className="form-label">昵称</label>
                    <input type="text" className="form-control" id="validationCustom02" name='usernicname' value={user.usernicname} onChange={handleInput} required />
                    <div className="valid-feedback">
                      不错的昵称。
                    </div>
                    <div className="invalid-feedback">
                      昵称不能为空。
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="validationCustomUsername" className="form-label">邮箱地址</label>
                    <div className="input-group has-validation">
                      <input type="email" className="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" name='username' value={user.username} onChange={handleInput} required />
                      <div className="valid-feedback">
                        邮箱正确。
                      </div>
                      <div className="invalid-feedback">
                        请输入正确的邮箱。
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="validationCustom03" className="form-label">密码</label>
                    <input type="password" className="form-control" id="validationCustom03" name='password' value={user.password} onChange={handleInput} required />
                    <div className="invalid-feedback">
                      请设置密码。
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required />
                      <label className="form-check-label" htmlFor="invalidCheck">
                        同意条款和条件
                      </label>
                      <div className="invalid-feedback">
                        提交前您必须同意。
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">注册</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Header />
        {userInfo? (
          <>
            <div id='mtcustom'></div>
            <div className="row mt-5">
              <div className="col-sm-12">
                <nav className="nav nav-pills flex-column flex-sm-row mt-5">
                  {/* 路由链接 */}
                  <NavLink className={computedClassName} to="./Comment"><i className="bi bi-house"></i> 主页</NavLink>
                  <NavLink className={computedClassName} to="./Profile"><i className="bi bi-person"></i> 个人资料</NavLink>
                </nav>
              </div>
            </div>
          </>
        ):(
          <>
            <div id='mtcustom'></div>
            <div className="row mt-5">
              <div className="col-sm-12">
                <nav className="nav nav-pills flex-column flex-sm-row mt-5">
                  {/* 路由链接 */}
                  <NavLink className={computedClassName} to="./Comment"><i className="bi bi-house"></i> 主页</NavLink>
                </nav>
              </div>
            </div>
          </>
        )}
        {/* 注册路由 */}
        {elements}
      </div>
      <Footer />
    </>
  );
}

export default App;
