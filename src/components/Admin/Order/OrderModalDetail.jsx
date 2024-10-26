import { Col, Modal, notification, Row, Select, Table } from "antd";
import moment from 'moment/moment';
import { FORMAT_DATE_DISPLAY } from '../../../utils/constant';
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { callFetchListOrder, updateStatusOrder } from "../../../services/api";


const OrderModalDetail = (props) => {
    const {
        modalOpenDetail, setModalOpenDetail,
        dataDetail, setDataDetail,
        itemDetail, setItemDetail,
        fetchOrder } = props;
   
    const [isChangeSelect, setIsChangeSelect] = useState(false);
    const [currentStatus, setCurrentStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateStatus = async () => {
        setIsLoading(true);
        const res = await updateStatusOrder(dataDetail.id, currentStatus);
        if (res && res.data) {
            setModalOpenDetail(false)
            setDataDetail(null)
            setItemDetail(null)
            setIsChangeSelect(false)
            await fetchOrder();
            message.success('Xóa book thành công');
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsLoading(false);
    }

    const columnsDetail = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'name',
            render: (item, record, index) => (
                <div className='image'>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${record?.product?.thumbnail}`} />,
                </div>
            )
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            // render: (item, record, index) => <a></a>,
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
            key: 'size',
            // render: (item, record, index) => <a></a>,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (item, record, index) => (
                <div className='price'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.price)}
                </div>
            )
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        }
    ];
    return (
        <>
            <Modal
                title="Chi tiết đơn hàng"
                style={{ top: 20 }}
                width="700px"
                maskClosable={false}
                open={modalOpenDetail}
                cancelText="Đóng"
                okText="Cập nhật"
                okButtonProps={isChangeSelect ? '' : { style: { display: 'none' } }}
                onOk={handleUpdateStatus}
                onCancel={() => {
                    setModalOpenDetail(false)
                    setDataDetail(null)
                    setItemDetail(null)
                    setIsChangeSelect(false)
                }
                }

            >
                <Row>
                    <Col span={8}>
                        <div className="title">
                            Mã hóa đơn:

                        </div>
                    </Col>
                    <Col span={16}>{dataDetail?.code}</Col>

                    <Col span={8}>
                        <div className="title">
                            Trạng thái đơn hàng:
                        </div>

                    </Col>
                    <Col span={16}>
                        <Select
                            optionFilterProp="label"
                            value={dataDetail?.status}
                            onChange={(value) => {
                                setIsChangeSelect(true);
                                setCurrentStatus(value);
                            }}
                            options={[
                                {
                                    value: 'Chờ xác nhận',
                                    label: 'Chờ xác nhận',
                                },
                                {
                                    value: 'Đã xác nhận',
                                    label: 'Đã xác nhận',
                                },
                                {
                                    value: 'Chờ giao hàng',
                                    label: 'Chờ giao hàng',
                                },
                                {
                                    value: 'Đang vận chuyển',
                                    label: 'Đang vận chuyển',
                                },
                                {
                                    value: 'Hoàn thành',
                                    label: 'Hoàn thành',
                                },
                            ]}
                        />
                    </Col>
                    <Col span={8}>
                        <div className="title">
                            Trạng thái thanh toán:
                        </div>

                    </Col>
                    <Col span={16}>{dataDetail?.payment === 'offline' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán'}</Col>

                    <Col span={8}>
                        <div className="title">
                            Ngày đặt hàng:

                        </div>

                    </Col>
                    <Col span={16}>{moment(dataDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}</Col>

                    <Col span={24}>
                        <div className="title">
                            Chi tiết sản phẩm:

                        </div>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columnsDetail}
                            dataSource={itemDetail}
                            size={"small"}
                            pagination={false} />
                    </Col>
                    <Col span={24}>
                        <div className="totalPrice">
                            <div className="totalPrice-text">Tổng giá trị đơn hàng:</div>
                            <div className="totalPrice-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetail?.totalPrice)}</div>
                        </div>
                    </Col>
                </Row>
            </Modal>
            
        </>
    )

}

export default OrderModalDetail