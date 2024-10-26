import { Col, Divider, Modal, Row, Table } from "antd"
import moment from 'moment/moment';
import { FORMAT_DATE_DISPLAY } from '../../../utils/constant';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import jsPDF from 'jspdf';
import './orderModalExport.scss'

const OrderModalExport = (props) => {
    const {
        modalOpenExport, setModalOpenExport,
        dataExport, setDataExport,
        itemExport, setItemExport
    } = props;

    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const columnsExport = [
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
                title="Thông tin đơn hàng"
                style={{ top: 20 }}
                width="700px"
                maskClosable={false}
                open={modalOpenExport}
                cancelText="Đóng"
                okText="Xuất hóa đơn"
                onOk={reactToPrintFn}
                onCancel={() => {
                    setModalOpenExport(false)
                    setDataExport(null)
                    setItemExport(null)
                }
                }

            >
                <Row className="table" ref={contentRef}>
                    <Col span={8}>
                        <div className="title">
                            Mã hóa đơn:
                        </div>
                    </Col>
                    <Col span={16}>{dataExport?.code}</Col>

                    <Col span={8}>
                        <div className="title">
                            Trạng thái thanh toán:
                        </div>
                    </Col>
                    <Col span={16}>{dataExport?.payment === 'offline' ? 'Thanh toán khi nhận hàng' : 'Đã thanh toán'}</Col>

                    <Col span={8}>
                        <div className="title">
                            Ngày đặt hàng:
                        </div>
                    </Col>
                    <Col span={16}>{moment(dataExport?.createdAt).format(FORMAT_DATE_DISPLAY)}</Col>

                    <Col span={8}>
                        <div className="title">
                            Tên khách hàng:
                        </div>
                    </Col>
                    <Col span={16}>{dataExport?.name}</Col>

                    <Col span={8}>
                        <div className="title">
                            Điện thoại:
                        </div>
                    </Col>
                    <Col span={16}>{dataExport?.phone}</Col>


                    <Divider />
                    <Col span={11}>
                        <div className="title">
                            Địa chỉ đặt hàng:
                        </div>
                        <p>369, Khu vực Thạnh Thắng, phường Thường Thạnh, Quận Cái Răng, Cần Thơ</p>
                    </Col>
                    <Col span={11}>
                        <div className="title">
                            Địa chỉ giao hàng:
                        </div>
                        <p>{dataExport?.address}</p>
                    </Col>

                    <Divider />
                    <Col span={24}>
                        <div className="title">
                            Chi tiết sản phẩm:
                        </div>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columnsExport}
                            dataSource={itemExport}
                            size={"small"}
                            pagination={false} />
                    </Col>
                    <Col span={24}>
                        <div className="totalPrice">
                            <div className="totalPrice-text">Tổng giá trị đơn hàng:</div>
                            <div className="totalPrice-price">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataExport?.totalPrice)}</div>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default OrderModalExport