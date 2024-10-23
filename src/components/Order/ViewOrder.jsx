import { Col, Divider, Empty, InputNumber, Row, Table } from 'antd';
import { DeleteTwoTone } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { doDeleteItemCartAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import './vieworder.scss'

const ViewOrder = (props) => {
    const carts = useSelector(state => state.order.carts);
    const [totalPrice, setTotalPrice] = useState(0);
    const dispatch = useDispatch();

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'thumbnail',
            key: 'name',
            render: (_, record) => (
                <div className='image'>
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${record?.detail?.thumbnail}`} />,
                </div>
            )
        },
        {
            title: 'Tên SP',
            dataIndex: 'title',
            key: 'tile',
            render: (_, record) =>
                <div className='title'>
                    {record?.detail?.name}
                </div>,
        },
        {
            title: 'Kích thước',
            dataIndex: 'size',
            key: 'size',
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) =>
                <div className='title'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.detail?.price)}
                </div>
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record) => (
                <div className='quantity'>
                    <InputNumber onChange={(value) => handleOnChangeInput(value, record)} value={record.quantity} />
                </div>
            )
        },
        {
            title: 'Tổng',
            dataIndex: 'sum',
            key: 'quantity',
            render: (_, record) =>
                <div className='title'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record?.detail?.price * record?.quantity)}
                </div>
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <DeleteTwoTone
                    style={{ cursor: "pointer" }}
                    onClick={() => dispatch(doDeleteItemCartAction({ id: record.id }))}
                    twoToneColor="#eb2f96"
                />
            ),
        },
    ];

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map(item => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum);
        } else {
            setTotalPrice(0);
        }
    }, [carts]);

    const handleOnChangeInput = (value, book) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: book, id: book.id }))
        }
    }

    return (
        <Row gutter={[20, 20]}>
            <Col md={18} xs={24}>
                {/* {carts?.map((book, index) => {
                    const currentBookPrice = book?.detail?.price ?? 0;
                    return (
                        <div className='order-book' key={`index-${index}`}>
                            <div className='book-content'>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book?.detail?.thumbnail}`} />
                                <div className='title'>
                                    {book?.detail?.name}
                                </div>
                                <div className='size'>
                                    <span>Size: {book?.size}</span>
                                </div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                </div>
                            </div>
                            <div className='action'>
                                <div className='quantity'>
                                    <InputNumber onChange={(value) => handleOnChangeInput(value, book)} value={book.quantity} />
                                </div>
                                <div className='sum'>
                                    Tổng:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * (book?.quantity ?? 0))}
                                </div>
                                <DeleteTwoTone
                                    style={{ cursor: "pointer" }}
                                    onClick={() => dispatch(doDeleteItemCartAction({ id: book.id }))}
                                    twoToneColor="#eb2f96"
                                />

                            </div>
                        </div>
                    )
                })} */}
                {
                    carts.length > 0 && <Table columns={columns} dataSource={carts} pagination={false} />
                }
                {carts.length === 0 &&
                    <div className='order-book-empty'>
                        <Empty
                            description={"Không có sản phẩm trong giỏ hàng"}
                        />
                    </div>
                }
            </Col>
            <Col md={6} xs={24} >
                <div className='order-sum'>
                    <div className='calculate'>
                        <span>  Tạm tính</span>
                        <span>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}
                        </span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button
                        disabled={carts.length === 0}
                        onClick={() => props.setCurrentStep(1)}
                    >
                        Mua Hàng ({carts?.length ?? 0})
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default ViewOrder;