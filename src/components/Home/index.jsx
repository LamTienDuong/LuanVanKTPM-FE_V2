import { FilterTwoTone, ReloadOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin, Empty, Breadcrumb, Slider } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { callFetchCategory, callFetchListBook, callFetchListBookActive } from '../../services/api';
import './home.scss';
import MobileFilter from './MobileFilter';
import { FaStar } from "react-icons/fa";
import Rating from './Rating';
const Home = () => {
    const [searchTerm, setSearchTerm] = useOutletContext();

    const [listCategory, setListCategory] = useState([]);

    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=name,asc");

    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const [inputFromValue, setInputFromValue] = useState(10000);
    const [inputToValue, setInputToValue] = useState(1000000);

    const onChange = (newValue) => {
        setInputFromValue(newValue[0]);
        setInputToValue(newValue[1]);


    };

    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const initCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.result.map(item => {
                    return { label: item.name, value: item.name }
                })
                setListCategory(d);
            }
        }
        initCategory();
    }, []);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery, searchTerm]);

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}&filter=`;

        if (filter) {
            query += `${filter}`;
        }
        if (filter) {
            if (searchTerm) {
                query += ` and name ~ '${searchTerm}'`;
            } else {
                query += ` and name ~ ''`;
            }
        } else {
            query += `name ~ '${searchTerm}'`;
        }

        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchListBookActive(query);
        if (res && res.data) {
            setListBook(res.data.result.filter(item => item.quantity > 0));
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }

    }

    const handleChangeFilter = (changedValues, values) => {
        // console.log(">>> check changedValues, values: ", changedValues, values);
        //only fire if category changes
        if (changedValues.category) {
            const cate = values.category;
            const slider = values.slider;
            if (cate.length > 0) {
                let search = '';
                cate.forEach((item, index) => {
                    if (index == 0) {
                        search += `category.name ~ '${item}'`;
                    } else {
                        search += ` or category.name ~ '${item}'`;
                    }

                });
                search += ` and price >: ${inputFromValue} and price <: ${inputToValue}`;
                setFilter(search);
            } else {
                let search = '';
                search += ` price >: ${inputFromValue} and price <: ${inputToValue}`;
                setFilter(search);
            }
        }

        if (changedValues.slider) {
            const cate = values.category;
            let search = '';
            search += ` price >: ${inputFromValue} and price <: ${inputToValue}`;

            if (cate && cate.length > 0) {
                cate.forEach((item, index) => {
                    if (index == 0) {
                        search += ` and category.name ~ '${item}'`;
                    } else {
                        search += ` or category.name ~ '${item}'`;
                    }

                });
            } else {
                search += ` and category.name ~ ''`;
            }
            setFilter(search)
        }

    }

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = '';
            if (values?.category?.length) {
                values.category.forEach((item, index) => {
                    if (index == 0) {
                        f += `category.name ~ '${item}'`;
                    } else {
                        f += ` or category.name ~ '${item}'`;
                    }
                });
                f += `and price >: ${values?.range?.from} and price <: ${values?.range?.to}`;
            } else {
                f += `price >: ${values?.range?.from} and price <: ${values?.range?.to}`;
            }
            setFilter(f);
        }
    }

    const items = [
        {
            key: "sort=sold,desc",
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: 'sort=createdAt,desc',
            label: `Hàng Mới`,
            children: <></>,
        },
        {
            key: 'sort=price,asc',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: 'sort=price,desc',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    const handleRedirectBook = (book) => {
        // const slug = convertSlug(book.mainText);
        navigate(`/product/id=${book.id}`)
    }

    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                    <Row gutter={[20, 20]}>
                        <Col md={4} sm={0} xs={0}>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span> <FilterTwoTone />
                                        <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                    </span>
                                    <ReloadOutlined title="Reset" onClick={() => {
                                        form.resetFields();
                                        setFilter('');
                                        setSearchTerm('');
                                        setInputFromValue(10000);
                                        setInputToValue(1000000);
                                    }}
                                    />
                                </div>
                                <Divider />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >
                                    <Form.Item
                                        name="category"
                                        label="Danh mục sản phẩm"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                {listCategory?.map((item, index) => {
                                                    return (
                                                        <Col span={24} key={`index-${index}`} style={{ padding: '7px 0' }}>
                                                            <Checkbox value={item.value} >
                                                                {item.label}
                                                            </Checkbox>
                                                        </Col>
                                                    )
                                                })}
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider />
                                    <Form.Item
                                        name="slider"
                                        label="Khoảng giá"
                                        labelCol={{ span: 24 }}
                                    >
                                        <Slider
                                            min={10000}
                                            max={1000000}
                                            range
                                            onChange={onChange}
                                            defaultValue={[10000, 1000000]} />
                                    </Form.Item>
                                    <Row>
                                        <Col span={24}>
                                            <InputNumber
                                                name='from'
                                                prefix="VND"
                                                style={{
                                                    width: '100%',
                                                }}
                                                min={10000}
                                                max={1000000}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                value={inputFromValue}
                                            />
                                        </Col>
                                        <Col span={24} style={{ textAlign: 'center' }}>
                                            <p>đến</p>
                                        </Col>
                                        <Col span={24}>
                                            <InputNumber
                                                name='to'
                                                prefix="VND"
                                                min={10000}
                                                max={1000000}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                value={inputToValue}
                                                style={{ width: '100%' }}
                                            />
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                        <Col md={20} xs={24} >
                            <Spin spinning={isLoading} tip="Loading...">
                                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                    <Row >
                                        <Tabs
                                            defaultActiveKey="sort=sold,desc"
                                            items={items}
                                            onChange={(value) => { setSortQuery(value) }}
                                            style={{ overflowX: "auto" }}
                                        />
                                        <Col xs={24} md={0}>
                                            <div style={{ marginBottom: 20 }} >
                                                <span onClick={() => setShowMobileFilter(true)}>
                                                    <FilterTwoTone />
                                                    <span style={{ fontWeight: 500 }}> Lọc</span>
                                                </span>

                                            </div>
                                        </Col>
                                        <br />
                                    </Row>
                                    <Row className='customize-row'>
                                        {listBook?.map((item, index) => {
                                            return (
                                                <div id={`product-${index}`} className="column" key={`book-${index}`} onClick={() => handleRedirectBook(item)}>
                                                    <div className='wrapper'>
                                                        <div className='group_content'>
                                                            <div className='thumbnail'>
                                                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${item.thumbnail}`} alt="thumbnail book" />
                                                            </div>
                                                            <div className='text' title={item.name}>{item.name}</div>
                                                            <div className='price'>
                                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.price ?? 0)}
                                                            </div>
                                                        </div>
                                                        <div className='group_rating'>
                                                            <div className='rating'>
                                                                {/* <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 10 }} /> */}
                                                                <Rating rating={item.id}/>
                                                                <span>Đã bán {item.sold}</span>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {listBook.length === 0 &&
                                            <div style={{ width: "100%", margin: "0 auto" }}>
                                                <Empty
                                                    description="Không có dữ liệu"
                                                />
                                            </div>

                                        }
                                    </Row>
                                    <div style={{ marginTop: 30 }}></div>
                                    <Row style={{ display: "flex", justifyContent: "center" }}>
                                        <Pagination
                                            current={current}
                                            total={total}
                                            pageSize={pageSize}
                                            responsive
                                            onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                                        />
                                    </Row>
                                </div>
                            </Spin>
                        </Col>
                    </Row>
                    <MobileFilter
                        isOpen={showMobileFilter}
                        setIsOpen={setShowMobileFilter}
                        handleChangeFilter={handleChangeFilter}
                        listCategory={listCategory}
                        onFinish={onFinish}
                    />
                </div>
            </div>
        </>
    )
}

export default Home;