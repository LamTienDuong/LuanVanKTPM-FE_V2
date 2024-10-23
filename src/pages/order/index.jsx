import ViewOrder from "../../components/Order/ViewOrder";
import { Breadcrumb, Button, message, Result, Steps } from 'antd';
import './order.scss';
import { useEffect, useState } from "react";
import Payment from "../../components/Order/Payment";
import { SmileOutlined, HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { callPlaceOrder } from "../../services/api";
import { useDispatch } from "react-redux";
import { doPlaceOrderAction } from "../../redux/order/orderSlice";

const OrderPage = (props) => {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const status = window.location.search.endsWith("success");

    useEffect(() => {
        if (status) {
            const order = JSON.parse(localStorage.getItem("order"));
            const fetchData = async () => {
                try {
                    const res = await callPlaceOrder(order);
                    if (res && res.data) {
                        message.success('Đặt hàng thành công !');
                        dispatch(doPlaceOrderAction());
                        setCurrentStep(2);
                        localStorage.removeItem("order");
                    } else {
                        notification.error({
                            message: "Đã có lỗi xảy ra",
                            description: res.message
                        })
                    }

                } catch (err) {
                    console.log(err);
                }
            };
            fetchData();
        } else {
            setCurrentStep(0);
            localStorage.removeItem("order");
        }
    }, []);

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Breadcrumb
                    style={{ margin: '5px 0' }}
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
                <div className="order-steps">
                    <Steps
                        size="small"
                        current={currentStep}
                        status={"finish"}
                        items={[
                            {
                                title: 'Đơn hàng',
                            },
                            {
                                title: 'Đặt hàng',
                            },
                            {
                                title: 'Thanh toán',
                            },
                        ]}
                    />
                </div>
                {currentStep === 0 &&
                    <ViewOrder setCurrentStep={setCurrentStep} />
                }
                {currentStep === 1 &&
                    <Payment setCurrentStep={setCurrentStep} />
                }

                {currentStep === 2 &&
                    <Result
                        icon={<SmileOutlined />}
                        title="Đơn hàng đã được đặt thành công!"
                        extra={<Button type="primary"
                            onClick={() => navigate('/history')}
                        >Xem lịch sử</Button>}
                    />
                }
            </div>
        </div>
    )
}

export default OrderPage;