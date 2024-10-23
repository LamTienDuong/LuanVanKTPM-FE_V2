import { Badge, Col, Descriptions, Divider, Menu, Modal, Pagination, Popconfirm, Row, Space, Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import ReactJson from 'react-json-view'
import { useDispatch, useSelector } from "react-redux";
import './history.scss';
import { FaRegEye } from "react-icons/fa6";
import { DeleteOutlined } from "@ant-design/icons";

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [dataDetail, setDataDetail] = useState(null);
    const [itemDetail, setItemDetail] = useState(null);

    const [currentMenu, setCurrentMenu] = useState('Tất cả');
    const [filter, setFilter] = useState('');

    const onClick = (e) => {
        console.log(e);
        if (e.key === 'Tất cả') {
            setFilter('');
        } else {
            setFilter(e.key);
        }
        setCurrentMenu(e.key);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const items = [
        {
            label: 'Tất cả',
            key: 'Tất cả',
        },
        {
            label: 'Chờ xác nhận',
            key: 'Chờ xác nhận',
        },
        {
            label: 'Chờ vận chuyển',
            key: 'Chờ vận chuyển',
        },
        {
            label: 'Hoàn thành',
            key: 'Hoàn thành',
        },
        // {
        //     label: 'Đã hủy',
        //     key: 'Đã hủy',
        // },

    ];

    useEffect(() => {
        const fetchHistory = async (id, current, pageSize, filter) => {
            const res = await callOrderHistory(user.id, current, pageSize, filter);
            if (res && res.data) {
                setTotal(res.data.meta.total);
                setOrderHistory(res.data.result);
            }
        }
        fetchHistory(user.id, current, pageSize, filter);
    }, [current, filter]);

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'index',
            key: 'index',
            render: (item, record, index) => (<a href="#">{record.code}</a>)
        },
        {
            title: 'Trạng thái',
            render: (item, record, index) => (

                <Tag color={"green"}>
                    {item.status}
                </Tag>
            )
        },
        {
            title: 'Thời gian đặt hàng',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return moment(record.createdAt).format(FORMAT_DATE_DISPLAY)
            }
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (item, record, index) => {
                return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item)
            }
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (item, record, index) => {
                return (
                    <div className="action">
                        <div className="action-detail"
                            onClick={() => {
                                setDataDetail(record);
                                setItemDetail(record.items);
                                setIsModalOpen(true);
                            }}
                        >
                            <FaRegEye />
                        </div>
                        {/* <div className="action-edit">
                            <Popconfirm
                                placement="left"
                                title="Xác nhận xóa đơn hàng"
                                description="Bạn chắc chắn xóa đơn hàng này ?"
                                okText="Xác nhận"
                                cancelText="Hủy"
                            >
                                <DeleteOutlined />
                            </Popconfirm>
                        </div> */}
                    </div>
                )
            }
        }
    ];

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
            <Divider />
            <div className="main">
                <div className="main-header">Lịch sử đặt hàng:</div>
                <Menu className="menu"
                    onClick={onClick}
                    selectedKeys={[currentMenu]}
                    mode="horizontal"
                    items={items} />
                <div className="table">
                    <Table
                        columns={columns}
                        dataSource={orderHistory}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            onChange: (pagination, filters, sorter, extra) => {

                                if (pagination && pagination !== current) {
                                    setCurrent(pagination);
                                }
                            }
                        }}
                    />
                </div>
            </div>
            <div className="modal">
                <Modal title="Chi tiết đơn hàng"
                    style={{ top: 20 }}
                    open={isModalOpen}
                    width="700px"
                    onOk={() => { }}
                    onCancel={handleCancel}
                    cancelText="Đóng"
                    maskClosable={false}
                    okButtonProps={{ style: { display: 'none' } }}>
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
                        <Col span={16}>{dataDetail?.status}</Col>
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
            </div>
        </>
    )
}

export default History;