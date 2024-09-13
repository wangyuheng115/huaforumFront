import React, { useEffect, useState, useRef } from 'react';
import ToolBar from '../components/ToolBar';
import './NewArticle.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import searchTags from '../Function/SearchTags.js';
import searchSingleTag from '../Function/SearchSingleTag.js';
import createNewTag from '../Function/CreateNewTag.js';

export default function NewArticle() {
    const [title, setTitle] = useState('');
    const [Options, setOptions] = useState({
        type: 'normal',
        bold: false,
        italic: false,
    });
    const [content, setContent] = useState('开始创作');
    const [oldcover, setOldCover] = useState(null);
    const elementToDelete = useRef(null);  // 用于存储将要删除的元素
    const [tags, setTag] = useState('');
    const [flagViewListaTag, setFlagViewListaTag] = useState(false);
    const [lastUserInput, setLastUserInput] = useState('');
    const [tagList, setTagList] = useState([]);
    const [singleTag, setSingleTag] = useState([]);
    const [countTag, setCountTag] = useState(0);
    const [countImg, setCountImg] = useState(0);
    const countImgRef = useRef(countImg);
    const maxChars = 2000;
    const [currentChars, setCurrentChars] = useState(0);
    const [authAccess, setAuthAccess] = useState(0); //访问权限 0 => 所有人 1 => 仅自己
    const [authComment, setAuthComment] = useState(1); //评论权限 1 => 允许 0=>不允许

    useEffect(() => {
        countImgRef.current = countImg; // 每当 countImg 变化时更新 ref 的值
    }, [countImg]);

    useEffect(() => {
        document.getElementById('Editor').addEventListener('compositionend', (event) => {
            const editorElement = document.getElementById('Editor');
            let textContent = editorElement.textContent || ''; // 获取当前文本内容
            setCurrentChars(textContent.length);
            // 修剪内容以确保不超过最大字符限制
            if (textContent.length > maxChars) {
                textContent = textContent.substring(0, maxChars);
                editorElement.textContent = textContent;
                document.getElementById('liveToastBtn').click();
            }

            // 保持光标在文本的最后
            const range = document.createRange();
            const sel = window.getSelection();

            // 确保光标位置在文本末尾
            if (editorElement.childNodes.length > 0) {
                const lastChild = editorElement.childNodes[editorElement.childNodes.length - 1];
                range.setStartAfter(lastChild);
                range.collapse(true);
            } else {
                range.setStart(editorElement, textContent.length);
                range.collapse(true);
            }

            sel.removeAllRanges();
            sel.addRange(range);
        });
        document.title = '新建文章';
        const textarea = document.getElementById('artitle');
        textarea.addEventListener('input', (e) => {
            textarea.style.height = '78px';
            textarea.style.height = e.target.scrollHeight + 'px';
        });
        textarea.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // 阻止默认行为
            }
        });

        const textareaTag = document.getElementById('artag');
        async function fetchTags(tagName) {
            const data = await searchTags(tagName);
            setTagList(data);
        }

        async function fetchSingleTags(tagName) {
            const data = await searchSingleTag(tagName);
            setSingleTag(data);
        }

        textareaTag.addEventListener('input', (e) => {
            moveCursorToEnd(textareaTag);
            adjustHeight(e.target);

            // 获取 textareaTag 的内容
            const content = e.target.textContent.trim();

            // 检查内容是否为空
            if (content === '') {
                setFlagViewListaTag(false);
                setLastUserInput('');
                return; // 直接退出函数，避免不必要的遍历
            }
            // 获取所有子节点
            const childNodes = textareaTag.childNodes;
            childNodes.forEach(node => {
                // 检查是否为文本节点，且内容不为空
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                    fetchTags(node.textContent.trim());
                    setFlagViewListaTag(true);
                    setLastUserInput(node.textContent.trim());
                    fetchSingleTags(node.textContent.trim());
                }
                else {
                    //fetchTags(node.textContent.trim());   
                    setLastUserInput('');
                    setFlagViewListaTag(false);
                }
            });
        });
        textareaTag.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // 阻止默认行为
            }
            // 延迟将光标移动到末尾，确保用户输入完成后调整光标
            setTimeout(() => {
                moveCursorToEnd(textareaTag);
            }, 0);
        });

        textareaTag.addEventListener('click', (event) => {
            moveCursorToEnd(textareaTag);
        });

        textareaTag.addEventListener('mousedown', (event) => {
            event.preventDefault();
        });
        textareaTag.addEventListener("paste", function (event) {
            // 阻止默认粘贴行为
            event.preventDefault();
        });
        textareaTag.addEventListener('blur', (e) => {
            if (textareaTag.textContent === '') {
                setFlagViewListaTag(false);
            }
        })

        const preview = document.getElementById('preview');
        var p_cover = document.getElementById('p_cover');

        preview.addEventListener("dragenter", function (e) {
            e.preventDefault();
            preview.classList.add('drag-over');
            p_cover = document.getElementById('p_cover');
            p_cover.style.position = 'fixed';
            p_cover.style.color = 'white';
            p_cover.innerText = '拖入封面';
        })
        preview.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
            preview.classList.add('drag-over');
            p_cover = document.getElementById('p_cover');
            p_cover.style.position = 'fixed';
            p_cover.style.color = 'white';
            p_cover.innerText = '拖入封面';
            e.dataTransfer.dropEffect = 'move';
        })
        // 当鼠标离开目标区域时
        preview.addEventListener("dragleave", function (e) {
            e.preventDefault();
            preview.classList.remove('drag-over'); // 移除类来恢复目标 div 的样式
            p_cover.innerText = '';
        });
        preview.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation(); // 停止事件传播
            preview.classList.remove('drag-over');
            p_cover.innerText = '';
            const files = e.dataTransfer.files;
            const upimage = document.getElementById('upimage');
            if (files.length >= 2) { alert('只能上传一张图片'); return false; }
            if (files.length > 0) {
                const file = files[0];

                if (file.type.includes('image')) {
                    upimage.files = files;
                    previewImage2(file);
                }
                else {
                    alert('请选择图片文件（JPEG 或 PNG 格式）');
                }
            }
            return false; // 阻止默认行为
        })

        //以下代码作用于刚加载完页面，快速选择文本模式也有效
        var editor = document.getElementById("Editor");
        // 创建一个新的文本节点
        var textNode = document.createTextNode('');

        // 将文本节点添加到编辑器中
        editor.appendChild(textNode);

        // 创建一个新的范围并选中文本节点
        var range = document.createRange();
        range.selectNodeContents(textNode);

        // 获取当前的选择对象并添加范围
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        window.addEventListener('beforeunload', function (event) {

            if (true) { event.preventDefault(); }

        });
        // 创建一个 MutationObserver 实例，并传入回调函数
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检测图片的删除
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeName === 'FIGURE') {
                            setCountImg(prevCount => prevCount - 1);
                            //console.log('Figutr removed:', node);
                        }
                    });

                    // 检测图片的增加
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'FIGURE') {
                            if (countImgRef.current >= 10) {
                                setCountImg(prevCount => prevCount + 1);
                                node.remove();
                                document.getElementById('imgAlertButton').click();
                            }
                            else {
                                setCountImg(prevCount => prevCount + 1);
                            }

                            //console.log('Figutr removed:', node);
                        }
                    });
                }
            }
        });
        // 启动观察
        observer.observe(editor, { childList: true, subtree: true });

        // 创建一个 MutationObserver 实例，并传入回调函数
        const observerTag = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 检测节点的删除
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeName === 'DIV' || node.nodeName === 'SPAN') {
                            //console.log('Tag removed:', node.textContent);
                            if (node.textContent.trim() !== '') {
                                setCountTag(prevCount => prevCount - 1);
                                setTag(preTag => {
                                    const tagToRemove = node.textContent.trim();
                                    const regex = new RegExp(`${tagToRemove},?\\s*`, 'g');
                                    return preTag.replace(regex, '').trim();
                                });
                            }
                        }
                    });

                    // 检测节点的增加
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'DIV' || node.nodeName === 'SPAN') {
                            //console.log('Tag removed:', node.textContent);
                            if (node.textContent.trim() !== '') {
                                setCountTag(prevCount => prevCount + 1);
                                setTag(preTag => preTag + node.textContent.trim() + ',');
                            }
                        }
                    });
                }
            }
        });
        // 启动观察
        observerTag.observe(textareaTag, { childList: true, subtree: true });

        document.getElementById("Editor").addEventListener("keydown", function (event) {
            const textContent = document.getElementById('Editor').textContent || ''; // 获取当前文本内容
            setCurrentChars(textContent.length);

            // 获取按键和是否按下 Ctrl 或 Cmd 键
            const key = event.key;
            const isControlKey = event.ctrlKey || event.metaKey; // `metaKey` 是 macOS 中的 Command 键

            // 允许方向键、复制、剪切、粘贴操作
            const allowedKeys = [
                'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'Tab', 'Escape', 'Backspace', 'Delete'
            ];
            const isAllowedKey = allowedKeys.includes(key) ||
                (isControlKey && ['c', 'x', 'a'].includes(key.toLowerCase()));

            // 如果当前文本内容长度超过最大限制，且按下的键不在允许的按键列表中
            if (textContent.length >= maxChars && !isAllowedKey) {
                event.preventDefault(); // 阻止默认行为
            }
            if (event.key === 'Backspace' || event.key === 'Delete') {
                const editor = document.getElementById("Editor");
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);

                // 检查编辑器中是否只有图片或空白节点
                const onlyContainsImagesOrEmptyText = editor.textContent.trim();

                // 检查用户是否全选了编辑器中的内容
                const isFullSelection = selection.rangeCount === 1 &&
                    range.startContainer === editor &&
                    range.endContainer === editor &&
                    range.startOffset === 0 &&
                    range.endOffset === editor.childNodes.length;
                // 如果编辑器中只有图片或空白节点且用户全选了所有内容，不触发温馨提示
                if (onlyContainsImagesOrEmptyText === '' && isFullSelection) {
                    return; // 直接返回，不阻止默认删除行为
                }

                // 检查删除行为是否涉及 FIGURE 或 IMG 元素
                const startNode = range.startContainer;
                const parentNode = startNode.parentNode;

                if (parentNode.nodeName === 'FIGURE' ||
                    (startNode.previousSibling && startNode.previousSibling.nodeName === 'FIGURE') ||
                    (startNode.previousSibling && startNode.previousSibling.nodeName === 'IMG') ||
                    (startNode.nextSibling && startNode.nextSibling.nodeName === 'FIGURE') ||
                    (startNode.nextSibling && startNode.nextSibling.nodeName === 'IMG')) {

                    // 记录将要删除的元素
                    if (parentNode.nodeName === 'FIGURE' || parentNode.nodeName === 'IMG') {
                        elementToDelete.current = parentNode;
                    } else if (startNode.previousSibling &&
                        (startNode.previousSibling.nodeName === 'FIGURE' || startNode.previousSibling.nodeName === 'IMG')) {
                        elementToDelete.current = startNode.previousSibling;
                    } else if (startNode.nextSibling &&
                        (startNode.nextSibling.nodeName === 'FIGURE' || startNode.nextSibling.nodeName === 'IMG')) {
                        elementToDelete.current = startNode.nextSibling;
                    }

                    event.preventDefault();
                    document.getElementById("confrimButton").click();
                }
            }
        });

        document.getElementById('artag').addEventListener("focus", function (event) {
            if (document.getElementById('artag').innerHTML.trim() === '')
                setFlagViewListaTag(true);
        });

        const toastTrigger = document.getElementById('liveToastBtn');
        const toastLiveExample = document.getElementById('liveToast');

        if (toastTrigger) {
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
            toastTrigger.addEventListener('click', () => {
                toastBootstrap.show()
            })
        }

    }, []);

    const handleChange = (event) => {
        const inputTitle = event.target.value;
        setTitle(inputTitle);
    }

    const handleSelectOption = (option) => {
        setOptions(option);
        // 清除整个文本的样式
        //document.execCommand('removeFormat', false, null);
        // 取消先前设置的粗体和斜体
        if (document.queryCommandState('bold')) {
            document.execCommand('bold', false, null);
        }
        if (document.queryCommandState('italic')) {
            document.execCommand('italic', false, null);
        }

        if (option.bold) {//粗体
            document.execCommand('bold', false, null);
        }
        if (option.italic) {//斜体
            document.execCommand('italic', false, null);
        }

        switch (option.type) {
            case 'normal':
                document.execCommand('fontSize', false, 3);//正常大小
                break;
            case 'h1':
                // 设置字体大小为 h1
                document.execCommand('fontSize', true, 6);
                break;
            case 'h2':
                // 设置字体大小为 h1
                document.execCommand('fontSize', true, 5);
                break;
            case 'h3':
                // 设置字体大小为 h1
                document.execCommand('fontSize', true, 4);
                break;
            default:
                document.execCommand('fontSize', false, 3);//正常大小
        }
    };
    const initEdit = (e) => {
        //用于隐藏placeholder
        if (e.target.classList[0] !== 'placeholde' && (e.target.innerHTML === '' || e.target.innerHTML === '<br>')) {
            handleSelectOption(Options);
            e.target.classList.add('placeholde');
        }
        else {
            e.target.classList.remove('placeholde');
        }

    }
    const openupimage = () => {
        const upimage = document.getElementById('upimage');
        upimage.click();
    }

    const previewImage = (event) => {
        const preview = document.getElementById('preview');
        const file = event.target.files[0];
        if (file) {
            if (file.type.includes('image')) {
                preview.innerHTML = '<span id="span_cover"></span><span id="p_cover"></span>';
                const reader = new FileReader();

                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                    setOldCover(event.target.files);
                };

                reader.readAsDataURL(file);
            }
            else {
                const upimage = document.getElementById('upimage');
                if (oldcover) {
                    upimage.files = oldcover;
                }
                else {
                    upimage.type = 'text';
                    upimage.type = 'file';
                }
                alert('请选择图片文件（JPEG 或 PNG 格式）');
            }
        }
    }

    const previewImage2 = (file) => {
        const preview = document.getElementById('preview');
        preview.innerHTML = '<span id="span_cover"></span><span id="p_cover"></span>';
        var reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };

        reader.readAsDataURL(file);
    };

    const handlePaste = (event) => {
        const editorElement = document.getElementById('Editor');
        const textContent = editorElement.textContent || ''; // 获取当前文本内容
        setCurrentChars(textContent.length);
        // 获取粘贴板的内容
        const pasteData = (event.clipboardData || window.clipboardData).getData('text');

        // 计算当前内容长度和剩余空间
        const currentLength = textContent.length;
        const remainingSpace = maxChars - currentLength;
        // 如果剩余空间不足以粘贴全部内容，则修剪粘贴内容
        if (remainingSpace < pasteData.length) {
            document.getElementById('liveToastBtn').click();
            event.preventDefault(); // 阻止默认粘贴行为
            return;
        }
        // 用于隐藏placeholder
        if (event.target.innerHTML === '' || event.target.innerHTML === '<br>') {
            event.target.classList.add('placeholde');
        } else {
            event.target.classList.remove('placeholde');
        }

        event.preventDefault();
        const clipboardData = event.clipboardData || window.clipboardData;
        const items = clipboardData.items;
        let countimg = 0;
        let countimg2 = 0;

        for (let i = 0; i < items.length; i++) {
            if (event.target.innerText.trim() === '') {
                event.target.classList.add('placeholde');
            }
            else {
                event.target.classList.remove('placeholde');
            }
            if (items[i].type.indexOf('image') !== -1) {
                countimg++;
                const file = items[i].getAsFile();
                if (countimg <= 10) {
                    countimg2 = countImgRef.current + countimg;
                    if (countimg2 <= 10) {
                        handleImage(file);
                    }
                    else {
                        document.getElementById('imgAlertButton').click();
                    }
                }
                else {
                    document.getElementById('imgAlertButton').click();
                }

            } else {
                const pastedData = clipboardData.getData('text/html');
                const plainText = pastedData.replace(/(<[^>]+>)/g, (match) => {
                    if (match.startsWith('<img')) {
                        // 如果是图片，则保留
                        return match;
                    } else {
                        // 否则移除样式
                        return '';
                    }
                });

                // Use a range to insert the HTML to avoid double paste
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    range.deleteContents();
                    const fragment = range.createContextualFragment(plainText);
                    range.insertNode(fragment);
                }
            }
        }
    };


    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy'; // 指定允许拖放操作的类型为复制
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;

        // 检查是否拖入了文件
        if (files.length > 0) {
            handleDragImage(files[0]); // 仅处理第一个拖入的文件
        }
    };

    const handleImage = (file) => {
        if (countImg <= 10) {
            var reader = new FileReader();
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
        } else {
            document.getElementById('imgAlertButton').click();
        }
    };

    const handleDragImage = (file) => {
        if (countImg <= 10) {
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
        } else {
            document.getElementById('imgAlertButton').click();
        }
    };

    const confirmDelete = () => {
        // 执行删除操作
        if (elementToDelete.current) {
            elementToDelete.current.remove();  // 删除元素
            elementToDelete.current = null;  // 清空引用
        }
    };

    const cancelDelete = () => {
        elementToDelete.current = null;  // 清空引用
    };

    const updateEditorContent = (event) => {
        // 获取点击的 div 元素
        if (countTag < 10) {
            const element = event.currentTarget;

            if (element && element.textContent) {
                const text = element.textContent.trim();  // 获取文本并去除空白字符
                const editor = document.getElementById("artag");
                if (lastUserInput) {
                    replaceUnwrappedText(editor, lastUserInput, ' ');
                }
                // 聚焦到可编辑的 div
                editor.focus();
                // 将光标移动到内容末尾
                moveCursorToEnd(editor);
                // 插入文本到可编辑的 div 中
                insertTextAtCursor(editor, text);
                adjustHeight(editor);
            }
        }
        else {
            document.getElementById('tagAlertButton').click();
        }
    };

    const replaceUnwrappedText = (parent, searchText, replacementText) => {
        const walker = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while ((node = walker.nextNode())) {
            if (node.parentNode.nodeName !== 'SPAN' && node.textContent.includes(searchText)) {
                node.textContent = node.textContent.replace(searchText, replacementText);
            }
        }
    };

    const moveCursorToEnd = (editor) => {
        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const insertTextAtCursor = (editor, text) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        // 创建一个div容器
        const container = document.createElement('div');
        container.style.display = "inline-block";
        container.style.whiteSpace = "nowrap";
        container.contentEditable = false;

        // 创建一个 <span> 元素，并设置 className 和文本内容
        const span = document.createElement("span");
        span.className = "badge text-bg-danger";
        span.style.cursor = "default";
        span.style.userSelect = "none";
        span.textContent = text + ' ';


        // 创建一个 <i> 元素，并设置 className
        const icon = document.createElement("i");
        icon.className = "bi bi-x-circle";
        icon.style = "cursor: pointer;";


        // 将图标添加为 <span> 的子节点
        span.appendChild(icon);
        // 创建一个空格节点
        const space = document.createTextNode(' ');
        /*range.insertNode(space); // 插入空格
        range.setStartAfter(space); // 将光标移到空格后面*/
        container.appendChild(space);
        container.appendChild(span);


        range.insertNode(container);

        range.setStartAfter(container);


        icon.addEventListener('click', () => {
            container.remove();
            space.remove();
            span.remove();  // 点击图标时删除整个 span
        });
        selection.removeAllRanges();
        selection.addRange(range);

        setFlagViewListaTag(false);
    };
    // 函数：调整可编辑的 div 高度
    const adjustHeight = (element) => {
        element.style.height = '36px'; // 重置高度
        element.style.height = element.scrollHeight + 'px'; // 根据内容设置高度
    };

    //函数：创建新的标签
    const addNewTag = (tagname) => {
        if (countTag < 10) {
            createNewTag(tagname);
            const editor = document.getElementById("artag");
            if (lastUserInput) {
                replaceUnwrappedText(editor, lastUserInput, ' ');
            }
            // 聚焦到可编辑的 div
            editor.focus();
            // 将光标移动到内容末尾
            moveCursorToEnd(editor);
            // 插入文本到可编辑的 div 中
            insertTextAtCursor(editor, tagname);
            adjustHeight(editor);
        }
        else {
            document.getElementById('tagAlertButton').click();
        }
    }
    return (
        <>
            <ToolBar Option={handleSelectOption} />
            <div className="container d-flex flex-column h-100">
                <form action="">
                    <div className="row">
                        <div className="col-10 offset-1 p-0">
                            <input id='upimage' type="file" accept="image/jpeg, image/png" onChange={previewImage} style={{ display: 'none' }} multiple={false} />
                            <div className='border' id="preview" onClick={openupimage}><span id='span_cover'></span><span id='p_cover'></span></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-1 p-0 border-start">
                            <div className="form-floating" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <textarea name='artitle' id='artitle' type="text" className="form-control-plaintext form-control-lg border-bottom" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" maxLength={50} onChange={handleChange} value={title} required />
                                <label htmlFor="artitle" className='mb-5' id='label-title'>文章标题</label>
                                <span style={{ marginRight: 'auto', fontStyle: 'italic', color: 'rgba(33,37,41,.65)' }}>{title.length}/50</span>
                            </div>
                        </div>
                        <div className="col-4 border-end position-relative">
                            <span className='text-body-secondary position-absolute bottom-0 start-25'><i className="bi bi-card-image" title='最多可上传10张图片'></i> {countImg}/10</span>
                            <span className='text-body-secondary position-absolute bottom-0 start-50'><i className="bi" title='最多可写2000字'>字</i> {currentChars}/{maxChars}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-10 offset-1 p-0 border">
                            <div id='Editor' className='placeholde p-3' style={{ width: "100%", height: "auto" }} contentEditable={Options ? true : false} placeholder="输入正文" onInput={initEdit} onPaste={handlePaste} onDragOver={handleDragOver} onDrop={handleDrop}></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-1 p-0 border-start">
                            <div className="form-floating" style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <div name='artag' id='artag' type="text" className="form-control-plaintext border-bottom" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" placeholder="如：日常，攻略，生活分享等" contentEditable></div>
                                <label htmlFor="artag" className='mb-5' id='label-artag'><i className="bi bi-tag"></i>标签</label>
                                <em className='text-nowrap fs-6 text-body-secondary'>（最多可有10个标签）</em>
                            </div>
                            {flagViewListaTag ?
                                (tagList && tagList.length > 0 ?
                                    (<div className="z-3 list-group">
                                        {(singleTag && singleTag.length > 0) || lastUserInput.trim() === '' ? '' : (<div className="list-group-item list-group-item-action text-bg-danger" onClick={() => addNewTag(lastUserInput.trim())}>
                                            <i className="bi bi-plus-square"></i> 新增标签
                                        </div>)}
                                        {tagList && tagList.map((item, index) => (
                                            <div key={index} className="list-group-item list-group-item-action" onClick={updateEditorContent}><i className="bi bi-tag-fill"></i> {item.tadescri}</div>
                                        ))}
                                    </div>
                                    )
                                    :
                                    (lastUserInput.trim() === '' ? (<div className="z-3 list-group">
                                        <div className="list-group-item list-group-item-action" onClick={updateEditorContent}><i className="bi bi-tag-fill"></i> 日常</div>
                                        <div className="list-group-item list-group-item-action" onClick={updateEditorContent}><i className="bi bi-tag-fill"></i> 生活</div>
                                        <div className="list-group-item list-group-item-action" onClick={updateEditorContent}><i className="bi bi-tag-fill"></i> 攻略</div>
                                    </div>) :
                                        (<div className="z-3 list-group">
                                            <div className="list-group-item list-group-item-action text-bg-danger" onClick={() => addNewTag(lastUserInput.trim())}>
                                                <i className="bi bi-plus-square"></i> 新增标签
                                            </div>
                                        </div>
                                        ))) : ''
                            }
                        </div>
                        <div className="col-4 border-end"></div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-1 p-0 border-start">
                            <div className="row">
                                <div className="col-6"><em className='text-nowrap fs-5 text-body-secondary'><i className="bi bi-search"></i> 谁能看到此文章</em></div>
                            </div>
                            <div className="row">
                                <div className="col-3 offset-1">
                                    <input type="radio" className="btn-check" name="options-view" id="op_everyone" autoComplete="off" defaultChecked onChange={() => setAuthAccess(0)} />
                                    <label className="btn btn-outline-danger" htmlFor="op_everyone"><i className="bi bi-people"></i> 所有人</label>
                                </div>
                                <div className="col-3">
                                    <input type="radio" className="btn-check" name="options-view" id="op_onlyme" autoComplete="off" onChange={() => setAuthAccess(1)} />
                                    <label className="btn btn-outline-danger" htmlFor="op_onlyme"><i className="bi bi-person"></i> 仅自己</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 border-end"></div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-1 p-0 border-start">
                            <div className="row">
                                <div className="col-6"><em className='text-nowrap fs-5 text-body-secondary'><i className="bi bi-chat-right-dots"></i> 评论权限</em></div>
                            </div>
                            <div className="row">
                                <div className="col-3 offset-1">
                                    <div className="form-check form-switch fs-5">
                                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked onChange={() => setAuthComment(authComment === 1 ? 0 : 1)} />
                                        <label className="form-check-label text-body-secondary fst-italic" htmlFor="flexSwitchCheckChecked">{authComment === 1 ? '允许评论' : '禁止评论'}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4 border-end"></div>
                    </div>
                    <div className="row">
                        <div className="col-6 offset-1 p-0 border-start border-bottom">
                        </div>
                        <div className="col-2 border-bottom"></div>
                        <div className="col-2 border-end border-bottom">
                            <div className="btn-group" role="group" aria-label="Basic outlined example">
                                <button type="button" className="btn btn-outline-secondary"><i className="bi bi-pencil-square"></i> 保存草稿</button>
                                <button type="button" className="btn btn-outline-danger"><i className="bi bi-upload"></i> 发布</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <button id="confrimButton" type="button" className="btn invisible" data-bs-toggle="modal" data-bs-target="#confirmModal">
                button
            </button>
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">温馨提示</h1>
                        </div>
                        <div className="modal-body">
                            是否删除图片？
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmDelete}>是</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelDelete}>否</button>
                        </div>
                    </div>
                </div>
            </div>

            <button id="tagAlertButton" type="button" className="btn invisible" data-bs-toggle="modal" data-bs-target="#tagAlert">
                button
            </button>
            <div className="modal fade" id="tagAlert" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">温馨提示</h1>
                        </div>
                        <div className="modal-body">
                            最多只能够添加10个标签。
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">我知道了</button>
                        </div>
                    </div>
                </div>
            </div>

            <button id="imgAlertButton" type="button" className="btn invisible" data-bs-toggle="modal" data-bs-target="#imgAlert">
                button
            </button>
            <div className="modal fade" id="imgAlert" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">温馨提示</h1>
                        </div>
                        <div className="modal-body">
                            图片数量已达到上限。
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">我知道了</button>
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" className="btn btn-primary invisible" id="liveToastBtn"></button>
            <div className="toast-container position-fixed top-50 start-50 translate-middle">
                <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-body">
                        文章最多只能写2000字哦~
                    </div>
                </div>
            </div>
        </>
    )
}
