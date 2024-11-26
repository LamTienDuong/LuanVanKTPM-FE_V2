import axios from '../utils/axios-customize';

export const callRegister = (name, email, password) => {
    const data = {
        name: name, 
        avatar: 'avatar.jpg',
        email: email, 
        password: password,
        role: {
            id: 1
        }
    }
    return axios.post('/api/v1/auth/register', data)
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout')
}

export const callFetchListUser = (query) => {
    // current=1&pageSize=3
    return axios.get(`/api/v1/user?${query}`)
}

export const callCreateAUser = (fullName, password, email, phone) => {
    return axios.post('/api/v1/user', { fullName, password, email, phone })
}

export const callBulkCreateUser = (data) => {
    return axios.post('/api/v1/user/bulk-create', data)
}

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put('/api/v1/user', { _id, fullName, phone })
}

export const callDeleteUser = (id) => {
    return axios.delete(`/api/v1/user/${id}`)
}

///////////////////////

export const callFetchListBook = (query) => {
    return axios.get(`/api/v1/products?${query}`)
}


export const callFetchCategory = () => {
    return axios.get('/api/v1/categories');
}

export const callCreateBook = (thumbnail, slider, name, price, sold, quantity, category) => {
    return axios.post('/api/v1/products', {
        thumbnail,
        slider,
        name,
        price,
        sold,
        quantity,
        category: { "id": category },
        isActive: true
    })
}

export const callUpdateBook = (id, thumbnail, slider, name, price, category, active, quantity, sold) => {
    return axios.put(`/api/v1/products`, {
        id,
        thumbnail,
        slider,
        name,
        price,
        category: {
            name: category
        },
        active,
        quantity,
        sold,
    })
}

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', fileImg);
    bodyFormData.append('folder', 'product');
    return axios({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            // "upload-type": "book"
        },
    });
}

export const callDeleteBook = (id) => {
    return axios.delete(`/api/v1/book/${id}`);
}

export const callFetchBookById = (id) => {
    return axios.get(`api/v1/products/${id}`)
}

export const createItemInOrder = (data) => {
    return axios.post('/api/v1/items', {
        ...data
    })
}

export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/orders', {
        ...data
    })
}

export const updateStatusOrder = (id, status) => {
    return axios.put('/api/v1/orders/status', {id, status})
}

export const callOrderHistory = (id, current, pageSize, filter) => {
    return axios.get(`/api/v1/history?&page=${current}&size=${pageSize}&filter=userId : ${id} and status ~ '${filter}'`);
}

export const callUpdateAvatar = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', fileImg);
    bodyFormData.append('folder', 'avatar');
    return axios({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const callUpdateUserInfo = (id, name, phone, avatar) => {
    return axios.put(`/api/v1/users`, {
        id, name, phone, avatar
    })
}

export const callUpdatePassword = (email, oldpass, newpass) => {
    return axios.post(`/api/v1/user/change-password`, {
        email, oldpass, newpass
    })
}

export const callFetchDashboard = () => {
    return axios.get('/api/v1/database/dashboard')
}

export const callFetchListOrder = (query) => {
    return axios.get(`/api/v1/orders?${query}`)
}

export const createReviews = (data) => {
    return axios.post(`/api/v1/reviews`, data)
}

export const findAllReviews = (current, pageSize, id) => {
    return axios.get(`/api/v1/reviews?page=${current}&size=${pageSize}&id=${id}`);
}

export const createAddress = (data) => {
    return axios.post(`/api/v1/addresses`, data);
}

export const updateAddress = (data) => {
    return axios.put(`/api/v1/addresses`, data);
}

export const deleteAddress = (id) => {
    return axios.delete(`/api/v1/addresses/${id}`);
}

export const createOrder = (amount) => {
    return axios.get(`/api/v1/vn-pay?amount=${amount}`);
}

export const getOrdersInDay = (day, month, year, minus) => {
    return axios.get(`/api/v1/orders/day?day=${day}&month=${month}&year=${year}&minus=${minus}`)
}

export const getAllCategory = () => {
    return axios.get(`/api/v1/categories`);
}