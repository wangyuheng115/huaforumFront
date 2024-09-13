import axios from 'axios';

export async function getUserInfo() {

    let token = localStorage.getItem('ysof_usertoken');
    let config = {
        headers: {
            'Authorization': 'JWT ' + token,
            'Content-Type': 'application/json'
        }
    };
    try {
        let response = await axios.get('http://192.168.1.148:8000/user/userinfo', config);
        //console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
    /*axios.get('http://localhost:8000/user/userinfo', config)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.log(error);
            return null;
        });*/

}
