import { getUserInfo } from '../Function/User_tool.js'
import { Logout } from '../Function/Logout.js'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        async function fetchData() {
            const data = await getUserInfo();
            setUserInfo(data);
        }
        fetchData();
    }, []);

    const navbarStyle = {
        backgroundImage: 'linear-gradient(#FF6060, #FF2323)',
        boxShadow: '0px 8px 10px #F1948A',
        fontFamily: 'STKaiti, SimSun, STSong, sans-serif',
        fontSize: '20px'
    };

    const rubyStyle = {
        fontFamily: 'STKaiti, SimSun, STSong, sans-serif',
        fontSize: '30px'
    };

    return (
        <div className="row">
            <div className="col">
                <header className="p-3 mb-3 border-bottom  fixed-top" style={navbarStyle}>
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                            <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
                                <img src="./images/logo2.png" alt="Logo" height="40px" width="40px" id='logo'/>
                                <ruby style={rubyStyle} id='logotitle'>
                                    <span id='logotitle'>华</span><rp>(</rp><rt>HUA</rt><rp>)</rp>
                                    友<rp>(</rp><rt>YOU</rt><rp>)</rp>
                                    圈<rp>(</rp><rt>QUAN</rt><rp>)</rp>
                                </ruby>
                            </a>
                            <div className="nav nav-underline col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 nav-masthead"></div>
                            {/* <div className="px-3"></div>
                            <ul className="nav nav-underline col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0 nav-masthead">
                                <li className="nav-item">
                                    <a className="nav-link fw-bold active" aria-current="page" href="/">首页</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link fw-bold" href="/">更多</a>
                                </li>
                            </ul> */}

                            <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                                <input type="search" className="form-control" placeholder="搜索..." aria-label="Search" id='search'/>
                            </form>

                            {
                                userInfo ?
                                    (
                                        <div className="dropdown text-end">
                                            <a href="/" className="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" data-bs-target="#modalSignin" aria-expanded="false">
                                                <img src={userInfo.useravatar ? ("http://192.168.1.148:8000" + userInfo.useravatar) : "./images/default.jpeg"} alt="mdo" width="32" height="32" className="rounded-circle" /> {userInfo.usernicname}
                                            </a>
                                            <ul className="dropdown-menu text-small" >
                                                <Link to="/profile" style={{ textDecoration: 'none' }}><li><a className="dropdown-item" href="/"><i className="bi bi-person"></i> 个人资料</a></li></Link>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><a className="dropdown-item" onClick={Logout} href="/"><i className="bi bi-person-down"></i> 退出</a></li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="position-relative d-block link-dark" style={{width:"45px",height:"40px",backgroundColor:"rgba(0, 0, 0, 0.5)",borderRadius:"50%",cursor:"pointer"}} data-bs-toggle="modal" data-bs-target="#modalSignin" id='login-button'>
                                                <span className="text-white position-absolute top-50 start-50 translate-middle" style={{fontSize: '0.7rem',pointerEvents: 'none'}}>登录</span>
                                            </div>
                                        </div>
                                    )

                            }

                        </div>
                    </div>
                </header>
            </div>
        </div>
    );
}
