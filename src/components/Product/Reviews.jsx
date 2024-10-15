
import { Avatar, List, Radio, Rate, Space } from 'antd';
import { useEffect, useState } from 'react';
import { findAllReviews } from '../../services/api';

const Reviews = (props) => {
    const { current, setCurrent, pageSize, total, listReviews } = props;
    console.log(listReviews);

    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');

    return (
        <>
            <List
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    total: total,
                    position,
                    align,
                    onChange: (pagination, filters, sorter, extra) => {
                        if (pagination && pagination !== current) {
                            setCurrent(pagination);
                        }
                    }
                }}
                dataSource={listReviews}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`${import.meta.env.VITE_BACKEND_URL}/images/avatar/${item.avatar}`} />}
                            title={
                                <>
                                    <a href="https://ant.design">{item.title}</a>
                                    <p>
                                        <Rate value={item?.rate} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    </p>
                                </>
                            }
                            description={`${item.description}`}
                        />
                    </List.Item>
                )}
            />
        </>
    )
}

export default Reviews