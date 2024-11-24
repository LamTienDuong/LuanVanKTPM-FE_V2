import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from 'antd';
import { callCreateAUser, callCreateBook, callFetchCategory, callUploadBookImg } from '../../../services/api';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
const ProductModalCreate = (props) => {
    const { openModalCreate, setOpenModalCreate } = props;
    const [isSubmit, setIsSubmit] = useState(false);

    const [listCategory, setListCategory] = useState([])
    const [form] = Form.useForm();


    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);

    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState([])
    const [dataSlider, setDataSlider] = useState([])

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [thumbnailErr, setThumbnailErr] = useState(false);
    const [sliderErr, setSliderErr] = useState(false);

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.result.map(item => {
                    return { label: item.name, value: item.id }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])


    const onFinish = async (values) => {
        if (thumbnailErr) {
            notification.error({
                message: 'Thông báo',
                description: 'Ảnh thumbnail phải là JPG hoặc PNG!'
            })
            return;
        }

        if (sliderErr) {
            notification.error({
                message: 'Thông báo',
                description: 'Ảnh slider phải là JPG hoặc PNG!'
            })
            return;
        }

        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng upload ảnh thumbnail!'
            })
            return;
        }
        if (dataSlider.length === 0) {
            notification.error({
                message: 'Thông báo',
                description: 'Vui lòng upload ảnh slider!'
            })
            return;
        }
        const { name, price, category, quantity, sold } = values;
        const thumbnail = dataThumbnail[0].name;
        const slider = dataSlider.map(item => item.name);

        setIsSubmit(true)
        const res = await callCreateBook(thumbnail, slider, name, price, sold, quantity, category);
        if (res && res.data) {
            message.success('Tạo mới sản phẩm thành công');
            form.resetFields();
            setDataSlider([]);
            setDataThumbnail([])
            setOpenModalCreate(false);
            await props.fetchBook()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUploadThumbnail = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            setThumbnailErr(true);
            // message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const beforeUploadSlider = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            setSliderErr(true);
            // message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };


    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);

        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileName,
                // uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileName,
                // uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setDataThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = dataSlider.filter(x => x.uid !== file.uid);
            setDataSlider(newSlider);
        }
    }

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const validatePrice = (_, value) => {
        if (value === undefined || value === null) {
            return Promise.reject(new Error('Vui lòng nhập giá tiền!'));
        }
        if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Giá tiền phải là số nguyên!'));
        }
        if (+value <= 0) {
            return Promise.reject(new Error('Giá tiền phải lớn hơn 0!'));
        }
        return Promise.resolve();
    };

    const validateQuantity = (_, value) => {
        if (value === undefined || value === null) {
            return Promise.reject(new Error('Vui lòng nhập số lượng!'));
        }
        if (!Number.isInteger(+value)) {
            return Promise.reject(new Error('Số lượng phải là số nguyên!'));
        }
        if (+value <= 0) {
            return Promise.reject(new Error('Số lượng phải lớn hơn 0!'));
        }
        return Promise.resolve();
    };

    return (
        <>

            <Modal
                title="Thêm mới sản phẩm"
                open={openModalCreate}
                // onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields();
                    setOpenModalCreate(false)
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
                            setOpenModalCreate(false)
                        }}>
                        Hủy
                    </Button>,
                    <Button
                        id="submit"
                        key="submit"
                        type="primary"
                        onClick={() => { form.submit() }}>
                        Tạo Mới
                    </Button>,

                ]}
            >
                <Divider />

                <Form
                    form={form}
                    name="basic"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Row gutter={15}>
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
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Giá tiền"
                                name="price"
                                rules={[{ validator: validatePrice }]}
                            >
                                <Input
                                    min={0}
                                    style={{ width: '100%' }}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Thể loại"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
                            >
                                <Select
                                    defaultValue={null}
                                    showSearch
                                    allowClear
                                    //  onChange={handleChange}
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Số lượng"
                                name="quantity"
                                rules={[{ validator: validateQuantity }]}
                            >
                                <Input
                                    min={1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Đã bán"
                                name="sold"
                                rules={[{ required: true, message: 'Vui lòng nhập số lượng đã bán!' }]}
                                initialValue={0}
                            >
                                <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} disabled />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    id='thumbnail'
                                    name="thumbnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUploadThumbnail}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file, "thumbnail")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    id='slider'
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUploadSlider}
                                    onChange={(info) => handleChange(info, 'slider')}
                                    onRemove={(file) => handleRemoveFile(file, "slider")}
                                    onPreview={handlePreview}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default ProductModalCreate;