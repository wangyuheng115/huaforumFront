import axios from 'axios';

const searchTags = async (tagname) => {
    try {
        // 发起 GET 请求到 Django API
        const response = await axios.get('http://192.168.1.148:8000/tags/searchtags', {
            params: { tagName: tagname }
        });

        // 打印返回的结果
        return response.data
        // 处理返回的结果，比如更新界面等
        // updateUI(response.data);

    } catch (error) {
        // 处理请求错误
        console.error('请求tags错误:', error);
    }
};

export default searchTags;
