import React, { useState } from 'react';

export default function ToolBar({ Option }) {
    const [Options, setOptions] = useState({
        type: 'normal',
        bold: false,
        italic: false,
    });

    const handleChange = (e) => {
        setOptions({
            ...Options,
            type: e.target.value,
        });
        Option({
            ...Options,
            type: e.target.value,
        });
    }

    const handleBoldChange = () => {
        setOptions({
            ...Options,
            bold: !Options.bold,
        });
        Option({
            ...Options,
            bold: !Options.bold,
        });
    }

    const handleItalicChange = () => {
        setOptions({
            ...Options,
            italic: !Options.italic,
        });
        Option({
            ...Options,
            italic: !Options.italic,
        });
    }

    const toggleUnderline = () => {//下划线
        document.execCommand('underline', false, null);
    };

    const toggleStrikethrough = () => {//删除线
        document.execCommand('strikeThrough', false, null);
    };

    const addOrderedList = () => {//有序列表
        document.execCommand('insertOrderedList', false, null);
    };

    const addUnorderedList = () => {//无序列表
        document.execCommand('insertUnorderedList', false, null);
    };

    const addTable = () => {//插入表格
        const tableHTML = `
            <table class="table table-hover border">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">第一列</th>
                <th scope="col">第二列</th>
                <th scope="col">第三列</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>数据1</td>
                <td>数据1</td>
                <td>数据1</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>数据2</td>
                <td>数据2</td>
                <td>数据2</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>数据3</td>
                <td>数据3</td>
                <td>数据3</td>
            </tr>
            </tbody>
        </table>
        `;
        document.execCommand('insertHTML', false, tableHTML);
    };
    
    const handleInsertImage = () => {//插入图片
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = handleImageSelect;
        input.click();
    };

    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        handleImage(file);
    };

    const handleImage = (file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const figure = document.createElement('figure');

            // 创建一个div容器
            const container = document.createElement('div');
            container.className = "d-flex justify-content-center d-block";
            container.contentEditable = false;

            const imgElement = document.createElement('img');
            imgElement.className = "img-thumbnail rounded";
            imgElement.src = e.target.result;
            imgElement.width = 650; // 设置图片宽度为 650px
            imgElement.maxHeight = 455; // 设置图片最高高度为 455px

            // 将img元素插入到容器中
            container.appendChild(imgElement);
            figure.appendChild(container);
            const newline = document.createElement('div');
            newline.style.width = '100%';
            newline.style.height = 'auto';
            newline.contentEditable = true;

            const newline2 = document.createElement('div');
            newline2.style.width = '100%';
            newline2.style.height = 'auto';
            newline2.contentEditable = true;

            const brelement = document.createElement('br');
            const brelement2 = document.createElement('br');
            newline.appendChild(brelement);
            newline2.appendChild(brelement2);

            // 获取当前的选区
            const selection = window.getSelection();

            if (selection.rangeCount > 0) {
                // 获取当前选区的范围
                const range = selection.getRangeAt(0);

                // 插入节点到光标位置
                range.insertNode(newline);
                range.insertNode(figure);
                range.insertNode(newline2);

                // 将光标移到 figure 元素之后（即图片之后）
                range.setStartAfter(newline2);
                range.collapse(true);

                // 更新选区
                selection.removeAllRanges();
                selection.addRange(range);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleInsertLink = () => {
        const url = prompt('请输入链接地址:');
        if (url) {
            document.execCommand('createLink', false, url);
        }
    };
    return (
        <div className="btn-group-vertical position-fixed m-5" role="group" aria-label="Basic checkbox toggle button group">
            <div >
                <input type="checkbox" className="btn-check dropdown-toggle" id="title-text" autoComplete="off" defaultChecked={true} data-bs-toggle="dropdown" aria-expanded="false" title='字体' />
                <label title='选择字体' className="btn btn-outline-danger" htmlFor="title-text"><h4>{Options.type === 'normal' ? (<i className="bi bi-type"></i>) : (Options.type === 'h1' ? (<i className="bi bi-type-h1"></i>) : (Options.type === 'h2' ? (<i className="bi bi-type-h2"></i>) : (<i className="bi bi-type-h3"></i>)))} ⁝</h4></label>
                <ul className="dropdown-menu p-0">
                    <div className="btn-group-vertical w-100" role="group" aria-label="Vertical radio toggle button group">
                        <input type="radio" className="btn-check" name="vbtn-radio" id="text-normal" autoComplete="off" value="normal" defaultChecked={Options.type === 'normal'} onClick={handleChange} />
                        <label className="btn btn-outline-danger" htmlFor="text-normal"><i className="bi bi-type"></i> 普通字体</label>
                        <input type="radio" className="btn-check" name="vbtn-radio" id="text-h1" autoComplete="off" value="h1" defaultChecked={Options.type === 'h1'} onClick={handleChange} />
                        <label className="btn btn-outline-danger" htmlFor="text-h1"><i className="bi bi-type-h1"></i> 一级标题</label>
                        <input type="radio" className="btn-check" name="vbtn-radio" id="text-h2" autoComplete="off" value="h2" defaultChecked={Options.type === 'h2'} onClick={handleChange} />
                        <label className="btn btn-outline-danger" htmlFor="text-h2"><i className="bi bi-type-h2"></i> 二级标题</label>
                        <input type="radio" className="btn-check" name="vbtn-radio" id="text-h3" autoComplete="off" value="h3" defaultChecked={Options.type === 'h3'} onClick={handleChange} />
                        <label className="btn btn-outline-danger" htmlFor="text-h3"><i className="bi bi-type-h3"></i> 三级标题</label>
                    </div>
                </ul>
            </div>
            <input type="checkbox" className="btn-check" id="bold-text" autoComplete="off" onClick={handleBoldChange} title='加粗' />
            <label title='加粗' className="btn btn-outline-danger" htmlFor="bold-text"><h4><i className="bi bi-type-bold"></i></h4></label>
            <input type="checkbox" className="btn-check" id="oblique-text" autoComplete="off" onClick={handleItalicChange} title='斜体' />
            <label title='斜体' className="btn btn-outline-danger" htmlFor="oblique-text"><h4><i className="bi bi-type-italic"></i></h4></label>
            <button type="button" className="btn btn-danger" title='下划线' onClick={toggleUnderline}><h5><i className="bi bi-type-underline"></i></h5></button>
            <button type="button" className="btn btn-danger" title='删除线' onClick={toggleStrikethrough}><h5><i className="bi bi-type-strikethrough"></i></h5></button>
            <button type="button" className="btn btn-danger" title='有序列表' onClick={addOrderedList}><h5><i className="bi bi-list-ol"></i></h5></button>
            <button type="button" className="btn btn-danger" title='无序列表' onClick={addUnorderedList}><h5><i className="bi bi-list-ul"></i></h5></button>
            <button type="button" className="btn btn-danger" title='插入表格' onClick={addTable}><h5><i className="bi bi-table"></i></h5></button>
            <button type="button" className="btn btn-danger" title='插入图片' onClick={handleInsertImage}><h5><i className="bi bi-card-image"></i></h5></button>
            <button type="button" className="btn btn-danger" title='插入链接' onClick={handleInsertLink}><h5><i className="bi bi-link-45deg"></i></h5></button>
        </div>
    )
}
