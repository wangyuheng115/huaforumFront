import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NonLogged = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); // 倒计时时间，单位：秒

    // 在组件挂载后，启动倒计时
    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                // 获取登录按钮元素
                const loginButton = document.getElementById('login-button');
                if (loginButton) {
                    // 模拟点击登录按钮
                    loginButton.click();
                }
                // 倒计时结束，跳转至登录页面
                navigate('/');
            }
        }, 1000);

        // 组件卸载时清除计时器
        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    // 处理返回首页按钮点击事件
    const handleGoHome = () => {
        navigate('/');
    };

    // 处理前往登录按钮点击事件
    const handleGoLogin = () => {
        const loginButton = document.getElementById('login-button');
                if (loginButton) {
                    // 模拟点击登录按钮
                    loginButton.click();
                }
                // 倒计时结束，跳转至登录页面
                navigate('/');
    };

    return (
        <div>
            <h1>用户未登录</h1>
            <p>将在 {countdown} 秒后跳转至登录页面</p>
            <button className="btn btn-danger" onClick={handleGoHome}>返回首页</button>&nbsp;
            <button className="btn btn-danger" onClick={handleGoLogin}>前往登录</button>
        </div>
    );
};

export default NonLogged;
