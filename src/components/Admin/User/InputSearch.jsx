import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, theme } from 'antd';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const onFinish = (values) => {
        const { name, email, phone } = values;

        let query = "filter=";
        if (name) {
            query += `name ~ '${values.name}'`;
        }

        if (name && email) {
            query += ` and email ~ '${values.email}'`;

        } else if (email) {
            query += `email ~ '${values.email}'`;
        }

        if ((name || email) && phone) {
            query += ` and phone ~ '${values.phone}'`
        } else if (phone) {
            query += `phone  '${values.phone}'`
        }
        // if (values.fullName) {
        //     query += `&fullName=/${values.fullName}/i`
        // }
        // if (values.email) {
        //     query += `&email=/${values.email}/i`
        // }

        // if (values.phone) {
        //     query += `&phone=/${values.phone}/i`
        // }

        if (query) {
            props.handleSearch(query);
        }


    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`name`}
                        label={`Name`}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`email`}
                        label={`Email`}
                    >
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`phone`}
                        label={`Số điện thoại`}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                    <Button
                        style={{ margin: '0 8px' }}
                        onClick={() => {
                            form.resetFields();
                            props.setFilter("");
                        }}
                    >
                        Clear
                    </Button>
                    {/* <a
                        style={{ fontSize: 12 }}
                        onClick={() => {
                            setExpand(!expand);
                        }}
                    >
                        {expand ? <UpOutlined /> : <DownOutlined />} Collapse
                    </a> */}
                </Col>
            </Row>
        </Form>
    );
};


export default InputSearch;