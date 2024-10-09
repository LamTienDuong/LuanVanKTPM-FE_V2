
import { Avatar, List, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { findAllReviews } from '../../services/api';

const Reviews = () => {
    const [listReviews, setListReviews] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);

    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');

    useEffect(() => {
        fetchReviews();
    }, [current, pageSize])

    const fetchReviews = async () => {
        const res = await findAllReviews();
        if (res && res.data) {
            const data = res.data.result.map(item => {
                return {
                    avatar: item.user.avatar,
                    title: item.user.name,
                    description: item.content
                }
            })
            setListReviews(data)
        }
    }

    return (
        <>
            <List
                pagination={{
                    current,
                    pageSize,
                    position,
                    align,
                    onChange: (pagination, filters, sorter, extra) => {
                        if (pagination && pagination !== current) {
                            setCurrent(pagination.current)
                        }
                    }
                }}
                dataSource={listReviews}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${item.avatar}`} />}
                            title={<a href="https://ant.design">{item.title}</a>}
                            description={`${item.description}`}
                        />
                    </List.Item>
                )}
            />
        </>
    )
}

export default Reviews