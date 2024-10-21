import { Badge, Col, Descriptions, Divider, Menu, Modal, Pagination, Row, Space, Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import ReactJson from 'react-json-view'
import { useDispatch, useSelector } from "react-redux";
import './history.scss';
import { FaRegEye } from "react-icons/fa6";
import { AiOutlineEdit } from "react-icons/ai";

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [dataDetail, setDataDetail] = useState(null);

    const [currentMenu, setCurrentMenu] = useState('Tất cả');
    const onClick = (e) => {
        console.log('click ', e);
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
        {
            label: 'Đã hủy',
            key: 'Đã hủy',
        },

    ];

    useEffect(() => {
        const fetchHistory = async (id, current, pageSize) => {
            const res = await callOrderHistory(user.id, current, pageSize);
            if (res && res.data) {
                setTotal(res.data.meta.total);
                setOrderHistory(res.data.result);
            }
        }
        fetchHistory(user.id, current, pageSize);
    }, [current]);

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
            title: 'Thời gian ',
            dataIndex: 'createdAt',
            render: (item, record, index) => {
                return moment(item).format(FORMAT_DATE_DISPLAY)
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
                                setIsModalOpen(true);
                            }}
                        >
                            <FaRegEye />
                        </div>
                        <div className="action-edit">
                            <AiOutlineEdit />
                        </div>
                    </div>
                )
            }
        }
    ];

    return (
        <>
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
                    open={isModalOpen}
                    onOk={() => { }}
                    onCancel={handleCancel}>
                    <Row>
                        <Col span={6}>
                            Mã hóa đơn:
                        </Col>
                        <Col span={18}>{dataDetail?.code}</Col>
                        <Divider />
                    </Row>
                </Modal>
            </div>
        </>
    )
}

export default History;