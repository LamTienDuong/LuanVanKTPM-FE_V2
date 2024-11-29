import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa"
import { findAllReviews } from "../../services/api";

const Rating = (props) => {
    const { rating } = props;
    const [listReviews, setListReviews] = useState([]);
    const [star, setStar] = useState(0);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        if (listReviews) {
            let star = 0;
            listReviews.forEach(item => {
                star += +item.rate;
            });
            if (listReviews.length != 0) {
                star = Math.round(star / listReviews.length);
                setStar(star);
            }
            setStar(0);
        }
    }, [listReviews])

    const fetchReviews = async () => {
        const res = await findAllReviews(current, pageSize, rating);
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

    return (
        <>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <FaStar style={{ color: '#ffce3d', fontSize: 16 }} />
                <div style={{ marginLeft: "5px" }} className="rating-star">{star}</div>
            </div>
        </>
    )
}

export default Rating