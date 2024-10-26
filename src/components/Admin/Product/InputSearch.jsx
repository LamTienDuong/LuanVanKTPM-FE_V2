import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, theme } from 'antd';
import { callFetchCategory } from '../../../services/api';

const InputSearch = (props) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([])

    const formStyle = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.result.map(item => {
                    return { label: item.name, value: item.name }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])

    const onFinish = (values) => {
        const { name, category, from = values.range.from, to = values.range.to } = values;

        let query = "filter=";
        if (name) {
            query += `name ~ '${values.name}'`;
        }

        if (name && category) {
            query += ` and category.name ~ '${values.category}'`;

        } else if (category) {
            query += `category.name ~ '${values.category}'`;
        }

        if ((name || category) && from) {
            query += ` and price >: '${values.range.from}'`
        } else if (from) {
            query += `price >: '${values.range.from}'`
        }

        if ((name || category || from) && to) {
            query += ` and price <: '${values.range.to}'`
        } else if (to) {
            query += `price <: '${values.range.to}'`
        }

        if (query) {
            props.handleSearch(query);
        }

        //remove undefined
        // https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
        // Object.keys(values).forEach(key => {
        //     if (values[key] === undefined) {
        //         delete values[key];
        //     }
        // });

        // if (values && Object.keys(values).length > 0) {
        //     // https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
        //     const params = new URLSearchParams(values).toString();
        //     props.handleSearch(params);
        // }
    };

    return (
        <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name={`name`}
                        label={`Tên sản phẩm`}
                    >
                        <Input  placeholder="Nhập tên sản phẩm"/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        labelCol={{ span: 24 }}
                        label="Thể loại"
                        name="category"
                    >
                        <Select
                            defaultValue={null}
                             placeholder="Chọn thể loại"
                            showSearch
                            allowClear
                            //  onChange={handleChange}
                            options={listCategory}
                        />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item
                        label="Khoảng giá"
                        labelCol={{ span: 24 }}
                    >
                        <Row gutter={[10, 10]} style={{ width: "100%" }}>
                            <Col xl={11} md={24}>
                                <Form.Item name={["range", 'from']}>
                                    <InputNumber
                                        name='from'
                                        min={0}
                                        placeholder="đ TỪ"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={2} md={0}>
                                <div > - </div>
                            </Col>
                            <Col xl={11} md={24}>
                                <Form.Item name={["range", 'to']}>
                                    <InputNumber
                                        name='to'
                                        min={0}
                                        placeholder="đ ĐẾN"
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
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