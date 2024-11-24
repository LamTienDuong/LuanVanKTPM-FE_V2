import { Row, Col, Rate, Divider, Button, Breadcrumb, Modal, Image, Form, Input, message, Radio } from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './BookLoader';
import { useDispatch, useSelector } from 'react-redux';
import { doAddBookAction } from '../../redux/order/orderSlice'
import { Link, useNavigate } from 'react-router-dom';
import Reviews from './Reviews';
import { createReviews, findAllReviews } from '../../services/api';

const ViewDetail = (props) => {
    const { dataBook } = props;
    const [form] = Form.useForm();
    const user = useSelector(state => state.account.user);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);

    const url = window.location.href;
    const id = url.split('id=')[1];

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [listReviews, setListReviews] = useState([]);

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [currentQuantity, setCurrentQuantity] = useState(1);
    const refGallery = useRef(null);
    const images = dataBook?.items ?? [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState(0)
    const desc = ['Rất tệ', 'Tệ', 'Tạm ổn', 'Tốt', 'Rất tốt'];
    const [star, setStar] = useState(0);
    const [size, setSize] = useState('S');

    const options = [
        {
            label: 'S',
            value: 'S',
        },
        {
            label: 'M',
            value: 'M',
        },
        {
            label: 'L',
            value: 'L',
        },
        {
            label: 'XL',
            value: 'XL',
        },
    ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, [current, pageSize]);


    useEffect(() => {
        if (listReviews) {
            let star = 0;
            listReviews.forEach(item => {
                star += +item.rate;
            });
            star = Math.round(star / listReviews.length);
            setStar(star);
        }
    }, [listReviews])

    const fetchReviews = async () => {
        const res = await findAllReviews(current, pageSize, id);
        if (res && res.data && res.data.result) {
            setTotal(res.data.meta.total);
            const data = res.data.result.map(item => {
                return {
                    avatar: item.user.avatar,
                    title: item.user.name,
                    description: item.content,
                    rate: item.rate
                }
            });
            setListReviews(data);
        }
    }

    const onFinish = async (values) => {
        setIsLoading(true);
        const data = {
            product: {
                id: dataBook.id
            },
            user: {
                id: user.id
            },
            rate: currentValue,
            content: values.text
        }
        const res = await createReviews(data);
        if (res && res.data) {
            message.success('Tạo mới bình luận thành công');
            form.resetFields();
            setIsModalOpen(false);
            await fetchReviews();
        }
        setIsLoading(false);

    }
    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }


    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1);
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1);
        }
    }

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value);
            }
        }
    }

    const handleAddToCart = (quantity, size, book) => {
        dispatch(doAddBookAction({ quantity, size: size, detail: book, id: book.id }))
    }

    const handleBuyNow = (quantity,size, book) => {
        dispatch(doAddBookAction({ quantity, size: size, detail: book, id: book.id }))
        navigate('/order');
    }

    const onChange = (pagination, filters, sorter, extra) => {
        // if (pagination && pagination.current !== current) {
        //     setCurrent(pagination.current)
        // }
        // if (pagination && pagination.pageSize !== pageSize) {
        //     setPageSize(pagination.pageSize)
        //     setCurrent(1);
        // }
        // if (sorter && sorter.field) {
        //     const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
        //     setSortQuery(q);
        // }
    };

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    style={{ margin: '5px 10px' }}
                    items={[
                        {
                            // href: '#',
                            title: <HomeOutlined />,
                        },
                        {
                            title: (
                                <Link to={'/'}>
                                    <span>Trang Chủ</span>
                                </Link>
                            ),
                        }
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook.id ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={images}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    {/* <div className='author'>Tác giả: <a href='#'>{dataBook?.author}</a> </div> */}
                                    <div className='title'>{dataBook?.name}</div>
                                    <div className='rating'>
                                        <Rate value={star} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" style={{
                                                borderColor: '#7cb305',
                                            }} />
                                            {listReviews.length} lượt đánh giá</span>
                                        <span className='sold'>
                                            <Divider type="vertical" style={{
                                                borderColor: '#7cb305',
                                            }} />
                                            Đã bán {dataBook.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook?.price ?? 0)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left-side'>Vận chuyển</span>
                                            <span className='right-side'>Miễn phí vận chuyển</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-side'>Số lượng</span>
                                        <span className='right-side'>
                                            <button id='minus' onClick={() => handleChangeButton('MINUS')} ><MinusOutlined /></button>
                                            <input id='value' onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                            <button id='plus' onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                        </span>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-side'>Kích thước</span>
                                        <span className='right-side'>
                                            <Radio.Group
                                                block
                                                options={options}
                                                defaultValue="S"
                                                optionType="button"
                                                buttonStyle="solid"
                                                onChange={(event) => { setSize(event.target.value); }}
                                            />
                                        </span>
                                    </div>
                                    <div className='buy'>
                                        <button id='add-to-cart' className='cart' onClick={() => handleAddToCart(currentQuantity, size, dataBook)}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Thêm vào giỏ hàng</span>
                                        </button>
                                        <button id='add-now'
                                            className='now'
                                            onClick={() => handleBuyNow(currentQuantity, size, dataBook)}
                                        >Mua ngay</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        :
                        <BookLoader />
                    }
                </div>
            </div>
            {isAuthenticated &&
                <div style={{ background: '#fff', padding: "20px 0", margin: '20px 0' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Đánh giá sản phẩm này</h3>
                        <p>Nếu đã mua sản phẩm này. Hãy đánh giá ngay để giúp hàng ngàn người chọn mua hàng tốt nhất bạn nhé!</p>
                        <Rate
                            style={{ fontSize: '300%' }}
                            tooltips={desc}
                            onChange={(value) => {
                                setCurrentValue(value);
                                setIsModalOpen(true);
                            }}
                            value={currentValue}
                        />
                        {currentValue ? <span>{desc[currentValue - 1]}</span> : null}
                    </div>
                    <Modal
                        title="Đánh giá sản phẩm"
                        open={isModalOpen}
                        onOk={() => { form.submit() }}
                        onCancel={() => {
                            form.resetFields();
                            setIsModalOpen(false);
                        }}
                        //do not close when click fetchBook
                        maskClosable={false}
                    >
                        {/* <Image
                        width={200}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    /> */}
                        <Form
                            form={form}
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Nội dung đánh giá"
                                name="text"
                                style={{ margin: '0 auto' }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập nội dung đánh giá!',
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Mời bạn chia sẻ thêm cảm nhận"
                                />
                            </Form.Item>
                            <Form.Item
                                style={{ margin: '0 auto' }}
                            >
                                <div style={{ textAlign: 'center' }}>
                                    <Rate
                                        disabled
                                        style={{ fontSize: '300%' }}
                                        tooltips={desc}
                                        value={currentValue}
                                    />
                                    <br />
                                    {currentValue ? <span>{desc[currentValue - 1]}</span> : null}
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            }
            <div style={{ background: '#fff', padding: "20px 100px", margin: '20px 0' }}>
                <h3 style={{ textAlign: 'center' }}>Đánh giá của khách hàng đối với sản phẩm {dataBook?.name}</h3>
                <Reviews
                    current={current}
                    setCurrent={setCurrent}
                    pageSize={pageSize}
                    total={total}
                    listReviews={listReviews}
                />
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook?.mainText}
            />
        </div>
    )
}

export default ViewDetail;