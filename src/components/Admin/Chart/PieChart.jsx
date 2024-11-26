import { Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";

const SimplePieChart = () => {

    const data = [
        {
            "subject": "áo dài tay",
            "A": 120,
            "B": 110,
            "fullMark": 150
        },
        {
            "subject": "áo ngắn tay",
            "A": 98,
            "B": 130,
            "fullMark": 150
        },
        {
            "subject": "quần dài",
            "A": 86,
            "B": 130,
            "fullMark": 150
        },
    ]

    return (
        <>
            <RadarChart outerRadius={90} width={730} height={250} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="Số lượng sản phẩm" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                {/* <Radar name="Lily" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} /> */}
                <Legend />
            </RadarChart>
        </>
    )

}

export default SimplePieChart