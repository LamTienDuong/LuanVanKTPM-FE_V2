import { Button, Col, Form, Input, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


const AddressModalCreate = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector(state => state.account.user);


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
                        initialValue={dataUpdate?.phone}
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
                        initialValue={dataUpdate?.province}
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
                        initialValue={dataUpdate?.district}
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
                        initialValue={dataUpdate?.ward}
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
                        initialValue={dataUpdate?.detail}
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
                                setIsModalUpdateOpen(false);
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
    )
}

export default AddressModalCreate