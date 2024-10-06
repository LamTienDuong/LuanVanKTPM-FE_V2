
import { Col, Divider, Form, Radio, Row, Select, message, notification } from 'antd';
import { DeleteTwoTone, LoadingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doPlaceOrderAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import { Input } from 'antd';
import { callPlaceOrder, createItemInOrder } from '../../services/api';
import axios from 'axios';
const { TextArea } = Input;

const Payment = (props) => {
    const carts = useSelector(state => state.order.carts);
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



    useEffect(() => {
        const getProvince = async () => {
            const res = await axios.get('https://provinces.open-api.vn/api/p/');
            if (res && res.data) {
                const provinces = res.data.map(item => {
                    return { label: item.name, value: item.code }
                });
                setProvince(provinces)
            }
        }
        getProvince();
    }, []);

    useEffect(() => {
        setDistrict([]);
        if (provinceCode) {
            const getDistrict = async () => {
                const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
                if (res && res.data && res.data.districts) {
                    const districts = res.data.districts.map(item => {
                        return { label: item.name, value: item.code }
                    });
                    setDistrict(districts);
                }
            }
            getDistrict();
        }
    }, [provinceCode]);

    useEffect(() => {
        if (districtCode) {
            const getWard = async () => {
                const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
                if (res && res.data && res.data.wards) {
                    const wards = res.data.wards.map(item => {
                        return { label: item.name, value: item.code }
                    });
                    setWard(wards);
                }
            }
            getWard();
        }
    }, [districtCode]);


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
        const provinceName = (await axios.get(`https://provinces.open-api.vn/api/p/${values.province}`)).data.name;
        const districtName = (await axios.get(`https://provinces.open-api.vn/api/d/${values.district}`)).data.name;
        const wardName = (await axios.get(`https://provinces.open-api.vn/api/w/${values.ward}`)).data.name;

        const address = `${values.address}, ${wardName}, ${districtName}, ${provinceName}`;

        setIsSubmit(true);

        let detailOrder = [];

        for (const item of carts) {
            let data = {
                name: item.detail.name,
                price: item.detail.price,
                quantity: item.quantity,
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
            name: values.name,
            address: address,
            phone: values.phone,
            totalPrice: totalPrice,
            userId: user.id,
            items: detailOrder
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
            <Col md={16} xs={24}>
                {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className='order-book' key={`index-${index}`}>
                            <div className='book-content'>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book?.detail?.thumbnail}`} />
                                <div className='title'>
                                    {book?.detail?.name}
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                </div>
                            </div>
                            <div className='action'>
                                <div className='quantity'>
                                    Số lượng: {book?.quantity}
                                </div>
                                <div className='sum'>
                                    Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => dispatch(doDeleteItemCartAction({ id: book.id }))}
                                    twoToneColor="#eb2f96"
                                />

                            </div>
                        </div>
                    )
                })}
            </Col>
            <Col md={8} xs={24} >
                <div className='order-sum'>
                    <Form
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            style={{ margin: 0 }}
                            labelCol={{ span: 24 }}
                            label="Tên người nhận"
                            name="name"
                            initialValue={user?.fullName}
                            rules={[{ required: true, message: 'Tên người nhận không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            style={{ margin: 0 }}
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            initialValue={user?.phone}
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>
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
                        <Form.Item
                            style={{ margin: 0 }}
                            labelCol={{ span: 24 }}
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                        >
                            <TextArea
                                // autoFocus
                                rows={4}
                            />
                        </Form.Item>
                    </Form>
                    <div className='info'>
                        <div className='method'>
                            <div>  Hình thức thanh toán</div>
                            <Radio checked>Thanh toán khi nhận hàng</Radio>
                        </div>
                    </div>

                    <Divider style={{ margin: "5px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "5px 0" }} />
                    <button
                        onClick={() => form.submit()}
                        disabled={isSubmit}
                    >
                        {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                        Đặt Hàng ({carts?.length ?? 0})
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default Payment;