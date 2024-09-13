import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';//使用hashrouter 使得生产环境中不会出现404的问题
import App from './App';
import NewArticle from './pages/NewArticle';

//进入build文件夹 运行serve 进入生产环境
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode> //严格模式会使组件渲染2次
    <HashRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/newarticle" element={<NewArticle />} />
      </Routes>
    </HashRouter>
  //</React.StrictMode>
);
