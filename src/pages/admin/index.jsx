import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from 'react-countup';
import { callFetchDashboard } from "../../services/api";
import { Line, LineChart } from "recharts";
import SimpleBarChart from "../../components/Admin/Chart/SimpleBarChart";
import '../../components/Admin/Chart/SimpleBarChart.scss';
import SimpleLineChart from "../../components/Admin/Chart/LineChart";

const AdminPage = () => {
    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0
    });


    useEffect(() => {
        const initDashboard = async () => {
            const res = await callFetchDashboard();
            if (res && res.data) setDataDashboard(res.data)
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
                        <Statistic title="Tổng Đơn hàng" value={dataDashboard.countOrder} precision={2} formatter={formatter} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Tổng sản phẩm"
                            value={dataDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>

                <Col className="simple-line-chart" span={24} style={{display: 'flex', justifyContent: 'center'}}>
                    <SimpleLineChart/>
                </Col>

                <Col className="simple-bar-chart" span={24} style={{display: 'flex', justifyContent: 'center'}}>
                    <SimpleBarChart/>
                </Col>
            </Row>

        </>
    )
}

export default AdminPage;