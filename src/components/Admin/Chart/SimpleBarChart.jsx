import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Rectangle,
    ResponsiveContainer,
} from "recharts";

const SimpleBarChart = () => {
    
    const data = [
        {
            "sản phẩm A": 4000,
            "sản phẩm B": 2400,
            "sản phẩm C": 4000,
            "sản phẩm D": 2400,
        },
    ]

    return (
        <>
            <BarChart width={730} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sản phẩm A" fill="#8884d8" />
                <Bar dataKey="sản phẩm B" fill="#82ca9d" />
                <Bar dataKey="sản phẩm C" fill="#f44336" />
                <Bar dataKey="sản phẩm D" fill="#80868b" />
            </BarChart>
        </>
    );

}

export default SimpleBarChart;