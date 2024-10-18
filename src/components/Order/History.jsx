import { Badge, Descriptions, Divider, Space, Table, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { callOrderHistory } from "../../services/api";
import { FORMAT_DATE_DISPLAY } from "../../utils/constant";
import ReactJson from 'react-json-view'
import { useDispatch, useSelector } from "react-redux";
import './history.scss'

const History = () => {
    const [orderHistory, setOrderHistory] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector(state => state.account.user);

    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchHistory = async (id, current, pageSize) => {
            const res = await callOrderHistory(user.id, current, pageSize);
            if (res && res.data) {
                setOrderHistory(res.data.result);
            }
        }
        fetchHistory(user.id, current, pageSize);
    }, []);

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
            title: 'Chi tiết',
            key: 'action',
            render: (_, record) => (
                <ReactJson
                    src={record.detail}
                    name={"Chi tiết đơn mua"}
                    collapsed={true}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                />
            ),
        },
    ];


    return (
        <div className="main">
            <div style={{ margin: "15px 0" }}>Lịch sử đặt hàng:</div>
            <Table
                columns={columns}
                dataSource={orderHistory}
                pagination={false}
            />
        </div>
    )
}

export default History;