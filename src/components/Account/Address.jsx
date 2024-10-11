import { Button, Col, Divider, Form, Input, Row, Select } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { TextArea } = Input;
import { GoPlus } from "react-icons/go";
import './Address.scss'
import { createAddress } from "../../services/api";
import { FaPen } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { DatabaseFilled, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AddressModalCreate from "./AddressModalCreate";

const Address = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user);
    const [isSubmit, setIsSubmit] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [dataUpdate, setDataUpdate] = useState(null);

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

    const handleUpdateAddress = (data) => {
        setDataUpdate(data)
    }


    const onFinish = async (values) => {
        const provinceName = (await axios.get(`https://provinces.open-api.vn/api/p/${values.province}`)).data.name;
        const districtName = (await axios.get(`https://provinces.open-api.vn/api/d/${values.district}`)).data.name;
        const wardName = (await axios.get(`https://provinces.open-api.vn/api/w/${values.ward}`)).data.name;

        const data = {
            province: provinceName,
            district: districtName,
            ward: wardName,
            detail: values.address,
            phone: values.phone,
            user: {
                id: user.id
            }
        }
        const res = await createAddress(data);

    }


    return (
        <>
            <div style={{ minHeight: 400 }}>
                <Row>
                    <div style={{
                        fontSize: '1.125rem',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <p>Địa chỉ của tôi</p>
                        <Button
                            style={{
                                background: '#EE4D2D',
                                color: 'white',
                            }}
                            onClick={() => setIsModalOpen(true)}
                            variant="solid">
                            Thêm mới địa chỉ
                        </Button>
                    </div>
                    <Divider />
                </Row>
                {!isModalOpen && !isModalUpdateOpen &&
                    user.address.map((item, index) => {
                        return (
                            <Row>
                                <Col span={4}>
                                    <a href="#" className="number-address">{`${item.phone}`}</a>
                                </Col>
                                <Col span={17}>
                                    <p>{`${item.detail}, ${item.ward}, ${item.district}, ${item.province} ${!item.active ? 'Mặc định' : ''}`}</p>
                                </Col>
                                <Col
                                    span={3}
                                    style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <EditOutlined
                                        style={{ color: 'blue', fontSize: '1.25rem', cursor: 'pointer' }}
                                        onClick={() => {
                                            handleUpdateAddress(item);
                                            setIsModalUpdateOpen(true);
                                        }
                                        }
                                    />
                                    <DeleteOutlined style={{ color: 'red', fontSize: '1.25rem', cursor: 'pointer' }} />
                                </Col>
                                <Divider />
                            </Row>
                        )
                    })
                }
                {isModalOpen &&
                    <Row>
                        <Col sm={24} md={24}>
                            <Form
                                onFinish={onFinish}
                                form={form}
                            >
                                <Form.Item
                                    hidden
                                    labelCol={{ span: 24 }}
                                    label="id"
                                    name="id"
                                    initialValue={user?.id}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Số điện thoại"
                                    name="phone"
                                    // initialValue={''}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Số điện thoại không được để trống!'
                                        },
                                        {
                                            pattern: /^(\+84|0)(3[0-9]|7[0-9]|8[0-9]|9[0-9]|1[2|6|8|9]|5[6|9]|4[0|1|2|3|4|5|6|7|8|9]|2[0|1|2|3|4|5|6|7|8|9])[0-9]{7}$/,
                                            message: "Số điện thoại không hợp lệ!"
                                        }
                                    ]}
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
                                <div className="group-button">
                                    <Button
                                        id="btn-close"
                                        type="primary"
                                        loading={isSubmit}
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            form.resetFields();
                                        }
                                        }
                                    >Trở lại</Button>
                                    <Button
                                        id="btn-add"
                                        type="primary"
                                        loading={isSubmit}
                                        onClick={() => form.submit()}
                                    >Thêm mới</Button>
                                </div>
                            </Form>
                        </Col>

                    </Row>
                }
                {isModalUpdateOpen &&
                    <AddressModalCreate
                        isModalUpdateOpen={isModalUpdateOpen}
                        setIsModalUpdateOpen={setIsModalUpdateOpen}
                        dataUpdate={dataUpdate}
                    />
                }
            </div>
        </>
    )
}

export default Address