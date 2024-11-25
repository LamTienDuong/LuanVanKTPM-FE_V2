import { Checkbox, Col, Divider, Form, Radio, Row, Select, Table, message, notification } from 'antd';
import { DeleteTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import { Input } from 'antd';
import { callPlaceOrder, createItemInOrder, createOrder } from '../../services/api';
import axios from 'axios';
import { redirect, useParams } from 'react-router-dom';
const { TextArea } = Input;
import './payment.scss'

const Payment = (props) => {
    const carts = useSelector(state => state.order.carts);
    console.log(carts);
    
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector(state => state.account.user);
    const [form] = Form.useForm();

    const [province, setProvince] = useState([]);
    const [provinceCode, setProvinceCode] = useState(null);
    const [district, setDistrict] = useState([]);
    const [districtCode, setDistrictCode] = useState(null);
    const [ward, setWard] = useState([]);

    const [provinceName, setProvinceName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [wardName, setWardName] = useState('');

    const [payment, setPayment] = useState("offline");

    const options = [
        {
            id: 'offline',
            label: 'Thanh toán khi nhận hàng',
            value: 'offline',
        },
        {
            id: 'online',
            label: 'Thanh toán online',
            value: 'online',
        }
    ];

    const columns = [
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) =>
                <div className='quantity'>
                    {record.quantity}
                </div>
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
            key: 'size',
            render: (_, record) =>
                <div className='size'>
                    {record.size}
                </div>
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) =>
                <div className='title'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.detail?.price)}
                </div>
        },

    ];

    const onChangePayment = (e) => {
        setPayment(e.target.value);
    };

    useEffect(() => {
        getProvince();
    }, []);

    useEffect(() => {
        setDistrict([]);
        if (provinceCode) {
            getDistrict();
        }
    }, [provinceCode]);

    useEffect(() => {
        if (districtCode) {
            getWard();
        }
    }, [districtCode]);

    const getProvince = async () => {
        // const res = await axios.get('https://provinces.open-api.vn/api/p/');
        const res = await axios.get('https://vapi.vnappmob.com/api/province/');
        if (res && res.data) {
            const provinces = res.data.results.map(item => {
                return { label: item.province_name, value: item.province_id }
            });
            setProvince(provinces)
        }
    }

    const getDistrict = async () => {
        // const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const res = await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceCode}`);
        if (res && res.data) {
            const districts = res.data.results.map(item => {
                return { label: item.district_name, value: item.district_id }
            });
            setDistrict(districts);
        }
    }

    const getWard = async () => {
        // const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const res = await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtCode}`);
        if (res && res.data) {
            const wards = res.data.results.map(item => {
                return { label: item.ward_name, value: item.ward_id }
            });
            setWard(wards);
        }
    }

    const handleChangeProvince = (value) => {
        setProvinceCode(value);
    };

    const handleChangeDistrict = (value) => {
        setDistrictCode(value);
    }


    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);


    const handlePlaceOrder = () => {
        if (!address) {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: "Thông tin địa chỉ không được để trống!"
            })
            return;
        }
        props.setCurrentStep(2);
    }

    const onFinish = async (values) => {
        const provinceList = (await axios.get('https://vapi.vnappmob.com/api/province/'));
        const provinceName = provinceList.data.results.filter((province) => province.province_id === values.province);

        const districtList = (await axios.get(`https://vapi.vnappmob.com/api/province/district/${provinceCode}`));
        const districtName = districtList.data.results.filter((district) => district.district_id === values.district);

        const wardList = (await axios.get(`https://vapi.vnappmob.com/api/province/ward/${districtCode}`));
        const wardName = wardList.data.results.filter((ward) => ward.ward_id === values.ward);

        // const provinceName = (await axios.get(`https://provinces.open-api.vn/api/p/${values.province}`)).data.name;
        // const districtName = (await axios.get(`https://provinces.open-api.vn/api/d/${values.district}`)).data.name;
        // const wardName = (await axios.get(`https://provinces.open-api.vn/api/w/${values.ward}`)).data.name;

        const address = `${values.address}, ${wardName[0].ward_name}, ${districtName[0].district_name}, ${provinceName[0].province_name}`;

        setIsSubmit(true);
        let detailOrder = [];

        for (const item of carts) {
            let data = {
                name: item.detail.name,
                price: item.detail.price,
                quantity: item.quantity,
                size: item.size,
                product: {
                    id: item.detail.id
                }
            };
            let result = await createItemInOrder(data);
            if (result && result.data) {
                detailOrder.push({ id: result.data.id });
            }
        }

        const data = {
            addressStore: '369, khu vực Thạnh Hòa, phường Thường Thạnh, quận Cái Răng, thành phố Cần Thơ',
            name: values.name,
            address: address,
            phone: values.phone,
            totalPrice: totalPrice,
            status: 'Chờ xác nhận',
            userId: user.id,
            payment: payment,
            items: detailOrder
        }

        if (payment === 'online') {
            const vnpayUrl = await createOrder(data.totalPrice);
            if (vnpayUrl.data) {
                window.location.replace(vnpayUrl.data.paymentUrl);
                localStorage.setItem("order", JSON.stringify(data));
                return
            }
        }

        const res = await callPlaceOrder(data);
        if (res && res.data) {
            message.success('Đặt hàng thành công !');
            dispatch(doPlaceOrderAction());
            props.setCurrentStep(2);
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.message
            })
        }
        setIsSubmit(false);
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={14} xs={24} >
                <div className='order-sum'>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Row gutter={[15, 15]}>
                            <Col span={12}>
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Tên người nhận"
                                    name="name"
                                    initialValue={user?.name}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Tên người nhận không được để trống!'
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Tên người nhận không được để trống!'
                                        },
                                        {
                                            pattern: /^[a-zA-Zà-ỹ\s]+$/,
                                            message: "Tên người nhận nhập vào không hợp lệ!"
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    initialValue={user?.phone}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống!'
                                        },
                                        {
                                            whitespace: true,
                                            message: 'Số điện thoại không được để trống!'
                                        },
                                        {
                                            pattern: /^(0[1-9][0-9]{8}|((09|01[2|6|8|9]|03|07|08|05)[0-9]{8}))$/,
                                            message: "Số điện thoại nhập vào không hợp lệ!"
                                        }
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Tỉnh/Thành phố"
                                    name="province"
                                    rules={[{ required: true, message: 'Tỉnh/Thành phố không được để trống!' }]}
                                >
                                    <Select
                                        // defaultValue={null}
                                        showSearch
                                        allowClear
                                        onChange={handleChangeProvince}
                                        options={province}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Quận/Huyện"
                                    name="district"
                                    rules={[{ required: true, message: 'Quận/Huyện không được để trống!' }]}
                                >
                                    <Select
                                        // defaultValue={null}
                                        showSearch
                                        allowClear
                                        onChange={handleChangeDistrict}
                                        options={district}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Xã/Phường"
                                    name="ward"
                                    rules={[{ required: true, message: 'Xã/Phường không được để trống!' }]}
                                >
                                    <Select
                                        // defaultValue={null}
                                        showSearch
                                        allowClear
                                        // onChange={handleChangeProvince}
                                        options={ward}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    style={{ margin: 0 }}
                                    labelCol={{ span: 24 }}
                                    label="Địa chỉ"
                                    name="address"
                                    rules={[
                                        {
                                            whitespace: true,
                                            message: "Địa chỉ không được để trống!"
                                        },
                                        { required: true, message: 'Địa chỉ không được để trống!' }]}
                                >
                                    <TextArea
                                        id='address'
                                        // autoFocus
                                        rows={4}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Form.Item
                        style={{ margin: 0 }}
                        labelCol={{ span: 24 }}
                        label="Hình thức thanh toán"
                        name="payment"
                        valuePropName="checked"
                    // rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                    >
                        <Radio.Group
                            block
                            options={options}
                            onChange={onChangePayment}
                            defaultValue={"offline"}
                        />
                    </Form.Item>
                    <Divider style={{ margin: "5px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "5px 0" }} />
                    <button
                        id='order'
                        onClick={() => form.submit()}
                        disabled={isSubmit}
                    >
                        {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                        Đặt Hàng ({carts?.length ?? 0})
                    </button>
                </div>
            </Col>
            <Col md={10} xs={0}>
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className='order-book' key={`index-${index}`}>
                            <div className='title'>
                                {book?.detail?.name}
                            </div>
                            <div className='book-content'>
                                <div className='book-content-img'>
                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book?.detail?.thumbnail}`} />
                                </div>
                                <div className='book-content-info'>
                                    <Table columns={columns} dataSource={[book]} pagination={false} />
                                    {/* <div className='quantity'>
                                        <div className='quantity-title'>Số lượng:</div>
                                        <div className='quantity-number'>{book?.quantity}</div>
                                    </div>
                                    <div className='size'>
                                        <div className='size-title'>Kích thước:</div>
                                        <div className='size-number'>size {book?.size}</div>
                                    </div>
                                    <div className='price'>
                                        <div className='price-title'>Giá tiền:</div>
                                        <div className='price-number'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}</div>
                                    </div> */}
                                </div>
                            </div>
                            {/* <div className='action'>
                                <div className='sum'>
                                    Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => dispatch(doDeleteItemCartAction({ id: book.id }))}
                                    twoToneColor="#eb2f96"
                                />
                            </div> */}
                        </div>
                    )
                })}
            </Col>
        </Row>
    )
}

export default Payment;