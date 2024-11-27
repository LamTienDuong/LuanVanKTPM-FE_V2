import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Switch } from 'antd';
import { callUpdateUser, callUpdateUserFromAdmin } from '../../../services/api';

const UserModalUpdate = (props) => {
    const { openModalUpdate, setOpenModalUpdate, dataUpdate, setDataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState(false);
    
    // https://ant.design/components/form#components-form-demo-control-hooks
    const [form] = Form.useForm();


    const onFinish = async (values) => {
        const { id, name, phone, email, active } = values;
        
        setIsSubmit(true);
        const res = await callUpdateUserFromAdmin(id, active);
        if (res && res.data) {
            message.success('Cập nhật user thành công!');
            setOpenModalUpdate(false);
            await props.fetchUser()
        } else {
            notification.error({
                message: 'Thông báo!',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    useEffect(() => {
        form.setFieldsValue(dataUpdate)
    }, [dataUpdate])

    return (
        <>

            <Modal
                title="Cập nhật người dùng"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                }}
                okText={"Cập nhật"}
                cancelText={"Hủy"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    initialValues={{switch: true}}
                // initialValues={dataUpdate}
                >
                    <Row gutter={[10, 10]}>
                        <Col span={24}>
                            <Form.Item
                                hidden
                                labelCol={{ span: 24 }}
                                label="Id"
                                name="id"
                                rules={[{ required: true, message: 'Vui lòng nhập Id!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên hiển thị"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                name="active"
                                label="Active"
                                valuePropName="checked" 
                            >
                                <Switch
                                    checkedChildren="YES"
                                    unCheckedChildren="NO"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default UserModalUpdate;