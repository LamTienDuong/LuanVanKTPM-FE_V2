import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getOrdersInDay } from "../../../services/api";

const SimpleLineChart = () => {
  const [listOrder, setListOrder] = useState([]);


  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    getListOrderInDay(day, month, year);
  }, []);

  const getListOrderInDay = async (day, month, year) => {
    const results = [];
    for (let i = 0; i <= 7; i++) {
      const data = await getOrdersInDay(day, month, year, i);
      if (data.data[0]) {
        results.push(data.data[0].totalPrice)
      } else {
        results.push(0);
      }
    }
    setListOrder(results);
  }

  const data = [
    {
      "name": "6 ngày trước",
      "doanh thu": listOrder[6],
    },
    {
      "name": "5 ngày trước",
      "doanh thu": listOrder[5],
    },
    {
      "name": "4 ngày trước",
      "doanh thu": listOrder[4],
    },
    {
      "name": "3 ngày trước",
      "doanh thu": listOrder[3],
    },
    {
      "name": "2 ngày trước",
      "doanh thu": listOrder[2],
    },
    {
      "name": "Hôm qua",
      "doanh thu": listOrder[1],
    },
    {
      "name": "Hôm nay",
      "doanh thu": listOrder[0],
    }
  ]


  return (
    <>
      <LineChart width={730} height={250} data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="doanh thu" stroke="#8884d8" />
        {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
      </LineChart>
    </>
  );
}

export default SimpleLineChart