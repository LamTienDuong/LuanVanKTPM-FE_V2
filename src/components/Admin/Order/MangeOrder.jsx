import React, { useEffect, useRef, useState } from 'react';
import { Table, Row, Col, Popconfirm, Button, message, notification, Select, Modal } from 'antd';
import { callFetchListOrder } from '../../../services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment/moment';
import { FORMAT_DATE_DISPLAY } from '../../../utils/constant';
import { FaEye } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import { CiExport } from 'react-icons/ci';
import OrderModalDetail from './OrderModalDetail';
import OrderModalExport from './OrderModalExport';

// https://stackblitz.com/run?file=demo.tsx
const MangeOrder = () => {
    const [listOrder, setListOrder] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("");

    const [status, setStatus] = useState("");

    const [modalOpenDetail, setModalOpenDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState(null);
    const [itemDetail, setItemDetail] = useState(null);

    const [modalOpenExport, setModalOpenExport] = useState(false);
    const [dataExport, setDataExport] = useState(null);
    const [itemExport, setItemExport] = useState(null);
   

    useEffect(() => {
        fetchOrder();
    }, [current, pageSize, filter, sortQuery, status]);

    const fetchOrder = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;

        if (status) {
            query += `&filter=status ~ '${status}'`
        }

        const res = await callFetchListOrder(query);
        if (res && res.data) {
            setListOrder(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'code',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        // setDataViewDetail(record);
                        // setOpenViewDetail(true);
                    }}>{record.code}</a>
                )
            }
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'user',
            render: (text, record, index) => {
                return (
                    <>{record.name}</>

                )
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (text, record, index) => {
                return (
                    <>{record.status}</>

                )
            },
        },
        {
            title: 'Thanh toán',
            dataIndex: 'payment',
            render: (text, record, index) => {
                return (
                    <>{record.payment === 'online' ? 'Đã thanh toán' : 'Thanh toán khi nhận hàng'}</>

                )
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (text, record, index) => {
                return (
                    <>{moment(record.createdAt).format(FORMAT_DATE_DISPLAY)}</>
                )
            }
        },
        {
            title: 'Giá trị',
            dataIndex: 'totalPrice',
            render: (text, record, index) => {
                return (
                    <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</>

                )
            },
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: (text, record, index) => {
                return (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
                            <FaEye
                                color='blue'
                                cursor="pointer"
                                fontSize='1rem'
                                onClick={() => {
                                    setModalOpenDetail(true);
                                    setDataDetail(record);
                                    setItemDetail(record.items)
                                }} />
                            <CiExport
                                color='blue'
                                cursor="pointer"
                                fontSize='1.25rem' 
                                onClick={() => {
                                    setModalOpenExport(true);
                                    setDataExport(record);
                                    setItemExport(record.items)
                                }}
                                />
                        </div>
                    </>
                )
            }
        },

    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };

    const onChangeStatus = (value) => {
        setStatus(value);
    };




    // change button color: https://ant.design/docs/react/customize-theme#customize-design-token
    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Danh sách đơn hàng</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Select
                        allowClear
                        placeholder="--Tất cả trạng thái--"
                        optionFilterProp="label"
                        onChange={onChangeStatus}
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
                </span>
            </div>
        )
    }

    const handleSearch = (query) => {
        setFilter(query);
    }



    

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        loading={isLoading}
                        bordered
                        columns={columns}
                        dataSource={listOrder}
                        onChange={onChange}
                        rowKey="id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                // showSizeChanger: true,
                                total: total,
                                // showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                            }
                        }
                    />
                </Col>
            </Row>
            <OrderModalDetail
                modalOpenDetail={modalOpenDetail}
                setModalOpenDetail={setModalOpenDetail}
                dataDetail={dataDetail}
                setDataDetail={setDataDetail}
                itemDetail={itemDetail}
                setItemDetail={setItemDetail}
                fetchOrder={fetchOrder}
            />
            <OrderModalExport
                modalOpenExport={modalOpenExport}
                setModalOpenExport={setModalOpenExport}
                dataExport={dataExport}
                setDataExport={setDataExport}
                itemExport={itemExport}
                setItemExport={setItemExport}
            />
        </>
    )
}


export default MangeOrder;