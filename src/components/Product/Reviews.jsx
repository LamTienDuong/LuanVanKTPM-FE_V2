
import { Avatar, List, Radio, Space } from 'antd';
import { useEffect, useState } from 'react';
import { findAllReviews } from '../../services/api';

const Reviews = () => {
   

    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');

    

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