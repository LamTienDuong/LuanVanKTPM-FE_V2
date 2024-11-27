import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { callFetchDashboard, countOrderByStatus, countProduct, countUserByRole } from "../../services/api";
import { Line, LineChart } from "recharts";
import SimpleBarChart from "../../components/Admin/Chart/SimpleBarChart";
import '../../components/Admin/Chart/SimpleBarChart.scss';
import SimpleLineChart from "../../components/Admin/Chart/LineChart";
import SimplePieChart from "../../components/Admin/Chart/PieChart";

const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0,
        countProduct: 0
    });


    useEffect(() => {
        const initDashboard = async () => {
            const resOrder = await countOrderByStatus("Hoàn thành");
            const resUser = await countUserByRole("USER");
            const resProduct = await countProduct();
            
            if (resOrder.statusCode == 200) {
                setDataDashboard(prevState => ({
                    ...prevState, // giữ lại tất cả các giá trị cũ
                    countOrder: resOrder.data // cập nhật countOrder với giá trị mới
                }));
            }

            if (resUser.statusCode == 200) {
                setDataDashboard(prevState => ({
                    ...prevState, // giữ lại tất cả các giá trị cũ
                    countUser: resUser.data // cập nhật countOrder với giá trị mới
                }));
            }

            if (resProduct.statusCode == 200) {
                setDataDashboard(prevState => ({
                    ...prevState, // giữ lại tất cả các giá trị cũ
                    countProduct: resProduct.data // cập nhật countOrder với giá trị mới
                }));
            }
            
            
        }
        initDashboard();
    }, []);

    const formatter = (value) => <CountUp end={value} separator="," />;
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Tổng Khách Hàng"
                            value={dataDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic title="Tổng Đơn hàng đã hoàn thành" value={dataDashboard.countOrder} precision={2} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Tổng sản phẩm"
                            value={dataDashboard.countProduct}
                            formatter={formatter}
                        />
                    </Card>
                </Col>

                {/* <Col className="simple-line-chart" span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="title">Phân loại số lượng sản phẩm</div>
                    <SimplePieChart />
                </Col> */}

                <Col className="simple-line-chart" span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="title">Thống kê doanh thu 7 ngày vừa qua</div>
                    <SimpleLineChart />
                </Col>

                <Col className="simple-bar-chart" span={24} style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className="title">Thống kê sản phẩm theo danh mục</div>
                    <SimpleBarChart />
                </Col>
            </Row>

        </>
    )
}

export default AdminPage;