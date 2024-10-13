import { Modal, Tabs } from "antd";
import UserInfo from "./UserInfo";
import ChangePassword from "./ChangePassword";
import Address from "./Address";
import { useState } from "react";

const ManageAccount = (props) => {
    const { isModalOpen, setIsModalOpen } = props;
    const [isModalOpenCreate, setIsModalOpenCreate] = useState(false);
    const [isModalOpenUpdate, setIsModalOpenUpdate] = useState(false);

    const onCancel = () => {
        setIsModalOpen(false);
        setIsModalOpenCreate(false);
        setIsModalOpenUpdate(false);
    }


    const items = [
        {
            key: 'info',
            label: `Hồ sơ cá nhân`,
            children: <UserInfo />,
        },
        {
            key: 'password',
            label: `Đổi mật khẩu`,
            children: <ChangePassword />,
        },
        {
            key: 'address',
            label: `Địa chỉ`,
            children: <Address
                isModalOpenCreate={isModalOpenCreate} 
                setIsModalOpenCreate={setIsModalOpenCreate}
                isModalOpenUpdate={isModalOpenUpdate}
                setIsModalOpenUpdate={setIsModalOpenUpdate}/>,
        },

    ];


    return (
        <Modal
            title="Quản lý tài khoản"
            open={isModalOpen}
            footer={null}
            onCancel={onCancel}
            maskClosable={false}
            width={"60vw"}
            style={{ top: 20 }}
        >
            <Tabs
                defaultActiveKey="info"
                items={items}
            />
        </Modal>
    )
}

export default ManageAccount;