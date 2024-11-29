import { EditTwoTone } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Select, Table } from "antd";
import { useState } from "react";
import { createCategory, updateCategory } from "../../../services/api";


const CategoryModelCreate = (props) => {

    const { openModalCategory, setOpenModalCategory,
        listCategory, setListCategory, fetchCategory
    } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    const [editingKey, setEditingKey] = useState('');
    const [inputValue, setInputValue] = useState('');

    const [isOpenCreate, setIsOpenCreate] = useState(false);

    const handleEdit = (key, name) => {
        setEditingKey(key);
        setInputValue(name);
    };

    const handleUpdate = async (id) => {
        setIsSubmit(true);
        const res = await updateCategory(id, inputValue);
        if (res && res.data) {
            await fetchCategory();
            message.success('Cập nhật danh mục thành công');
            setEditingKey('');
            setInputValue('');
        } else {
            notification.error({
                message: 'Thông báo!',
                description: res.error
            })
        }
        setIsSubmit(false);
    };

    const cancelUpdate = () => {
        setEditingKey('');
        setInputValue('');
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                editingKey === record.id ? (
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                ) : (
                    <span>{text}</span>
                )
            ),

        },
        {
            title: 'Action',
            render: (text, record, index) => (
                editingKey === record.id ? (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button
                            type="primary"
                            onClick={() => handleUpdate(record.id)}
                            loading={isSubmit}
                        >Lưu</Button>
                        <Button
                            type="primary"
                            onClick={cancelUpdate}
                        >Hủy</Button>
                    </div>

                ) : (
                    <Button onClick={() => handleEdit(record.id, record.name)}>Cập nhật</Button>
                )
            )

        }
    ];

    const onFinish = async (values) => {
        setIsSubmit(true);
        const res = await createCategory(values.name);
        if (res && res.data) {
            await fetchCategory();
            message.success('Thêm mới danh mục thành công');
            setIsOpenCreate(false);
            form.resetFields();
        } else {
            notification.error({
                message: 'Thông báo!',
                description: res.error
            })
        }
        setIsSubmit(false);
    }

    return (
        <>
            <Modal
                title="Danh mục sản phẩm"
                open={openModalCategory}
                // onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCategory(false)
                }}
                // okText={"Tạo mới"}
                // cancelText={"Hủy"}
                confirmLoading={isSubmit}
                width={"50vw"}
                style={{ top: 20 }}
                //do not close when click fetchBook
                maskClosable={false}
                footer={[
                    <Button
                        id="cancel"
                        key="cancel"
                        onClick={() => {
                            form.resetFields();
                            setOpenModalCategory(false)
                        }}>
                        Đóng
                    </Button>,

                    // <Button
                    //     id="submit"
                    //     key="submit"
                    //     type="primary"
                    //     onClick={() => { form.submit() }}>
                    //     Tạo Mới
                    // </Button>,

                ]}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    <Row style={{ marginBottom: '20px', display: 'flex', flexDirection: 'row' }}>
                        {!isOpenCreate ?
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => setIsOpenCreate(true)}
                                >
                                    Thêm mới danh mục
                                </Button>
                            </Col>
                            :
                            <Col span={24}>
                                <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Col>
                                        <Form.Item
                                            labelCol={{ span: 12 }}
                                            label="Tên danh mục"
                                            name="name"
                                            rules={[
                                                {
                                                    whitespace: true,
                                                    message: "Vui lòng nhập tên danh mục!"
                                                },
                                                { required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col>
                                        <Button
                                            type="primary"
                                            onClick={() => form.submit()}
                                            loading={isSubmit}
                                        >
                                            Xác nhận
                                        </Button>
                                        <Button
                                            type="primary"
                                            style={{ marginLeft: '10px' }}
                                            onClick={() => {
                                                setIsOpenCreate(false)
                                                form.resetFields();
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        }
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table dataSource={listCategory} columns={columns} pagination={false} />
                        </Col>
                    </Row>

                    {/* <Row gutter={15}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Tên sản phẩm"
                                name="name"
                                rules={[
                                    {
                                        whitespace: true,
                                        message: "Vui lòng nhập tên sản phẩm!"
                                    },
                                    { required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row> */}
                </Form>
            </Modal>
        </>
    );

}

export default CategoryModelCreate