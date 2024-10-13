import { Button, Checkbox, Col, Form, Input, message, notification, Row, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callFetchAccount, updateAddress } from "../../services/api";
import { doGetAccountAction } from "../../redux/account/accountSlice";
import { TbRuler } from "react-icons/tb";


const AddressModalUpdate = (props) => {
    const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate } = props;
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [isSubmit, setIsSubmit] = useState(false);
    const user = useSelector(state => state.account.user);

    const [changeForm, setChangeForm] = useState(false);

    const [provinceUpdate, setProvinceUpdate] = useState({});
    const [districtUpdate, setDistrictUpdate] = useState({});
    const [wardUpdate, setWardUpdate] = useState({});

    const [provinceList, setProvinceList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);

    const [checked, setChecked] = useState(true);
    const [disabled, setDisabled] = useState(false);

    const getProvinceUpdate = async () => {
        const provinceOject = await axios.get(`https://provinces.open-api.vn/api/p/search/?q=${dataUpdate?.province}`);
        setProvinceUpdate({ label: provinceOject.data[0].name, value: provinceOject.data[0].code });
    }

    const getDistrictUpdate = async () => {
        const districtOject = await axios.get(`https://provinces.open-api.vn/api/d/search/?q=${dataUpdate?.district}`);
        setDistrictUpdate({ label: districtOject.data[0].name, value: districtOject.data[0].code });

    }

    const getWardUpdate = async () => {
        const wardOject = await axios.get(`https://provinces.open-api.vn/api/w/search/?q=${dataUpdate?.ward}`);
        setWardUpdate({ label: wardOject.data[0].name, value: wardOject.data[0].code });
    }

    const getProvinceApi = async () => {
        const res = await axios.get('https://provinces.open-api.vn/api/p/');
        if (res && res.data) {
            const provinces = res.data.map(item => {
                return { label: item.name, value: item.code }
            });
            setProvinceList(provinces)
        }
    }

    const getDistrictApi = async () => {
        if (provinceUpdate.code) {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceUpdate.code}?depth=2`);
            if (res && res.data) {
                const districtList = res.data.map(item => {
                    return { label: item.name, value: item.code }
                });
                setDistrictList(districtList)
            }
        }


    }

    const getWardApi = async () => {
        if (districtUpdate.code) {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtUpdate.code}?depth=2`);
            if (res && res.data) {
                const wardList = res.data.map(item => {
                    return { label: item.name, value: item.code }
                });
                setDistrictList(wardList)
            }
        }
    }

    useEffect(() => {
        getProvinceUpdate();
        getDistrictUpdate();
        getWardUpdate();
        getProvinceApi();
    }, []);


    useEffect(() => {
        getDistrictApi();
    }, [provinceUpdate])

    useEffect(() => {
        getWardApi();
    }, [districtUpdate])

    const onFinish = async (values) => {
        let data = {}

        if (changeForm) {
            const provinceName = (await axios.get(`https://provinces.open-api.vn/api/p/${values.province}`)).data.name;
            const districtName = (await axios.get(`https://provinces.open-api.vn/api/d/${values.district}`)).data.name;
            const wardName = (await axios.get(`https://provinces.open-api.vn/api/w/${values.ward}`)).data.name;

            data = {
                id: values.id,
                province: provinceName,
                district: districtName,
                ward: wardName,
                detail: values.address,
                phone: values.phone,
                user: {
                    id: user.id
                },
                active: values.default
            }
        } else {
            data = {
                id: values.id,
                province: values.province,
                district: values.district,
                ward: values.ward,
                detail: values.address,
                phone: values.phone,
                user: {
                    id: user.id
                },
                active: values.default
            }
        }

        const res = await updateAddress(data);
        if (res) {
            setIsModalUpdateOpen(false);
            form.resetFields();
            const account = await callFetchAccount();
            if (account && account.data && account.data.user) {
                dispatch(doGetAccountAction(account.data));
            }
            message.success('Cập nhật địa chỉ thành công');
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }

    }

    return (
        <Row>
            <Col sm={24} md={24}>
                <h3 style={{ textAlign: 'center' }}>Cập nhật địa chỉ</h3>
                <Form
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }}
                        label="id"
                        name="id"
                        initialValue={dataUpdate?.id}
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
                        initialValue={dataUpdate.province}
                        rules={[{ required: true, message: 'Tỉnh/Thành phố không được để trống!' }]}
                    >
                        <Select
                            showSearch
                            allowClear
                            onChange={() => { }}
                            options={provinceList}
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
                            onChange={() => { }}
                            options={districtList}
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
                            showSearch
                            allowClear
                            options={wardList}
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
                    <Form.Item
                        style={{ margin: 0 }}
                        labelCol={{ span: 24 }}
                        valuePropName="checked"
                        name="default"
                        initialValue={dataUpdate?.active}
                    >
                        <Checkbox >Đặt làm địa chỉ mặc định</Checkbox>
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
                        >Cập nhật</Button>
                    </div>
                </Form>
            </Col>

        </Row>
    )
}

export default AddressModalUpdate