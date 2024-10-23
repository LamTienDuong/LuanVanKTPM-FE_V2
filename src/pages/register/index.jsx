import { Button, Divider, Form, Input, message, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '../../services/api';
import './register.scss';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);

    const onFinish = async (values) => {
        const { name, email, password} = values;
        setIsSubmit(true);
        const res = await callRegister(name, email, password);
        setIsSubmit(false);
        if (res?.data?.id) {
            message.success('Đăng ký tài khoản thành công!');
            navigate('/login')
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
    };


    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Ký Tài Khoản</h2>
                            <Divider />
                        </div>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Họ tên"
                                name="name"
                                rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                            >
                                <Input id='username'/>
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Email không được để trống!' },
                                    {
                                        type: 'email',
                                        message: 'Email nhập vào không hợp lệ!',
                                    },
                                ]}
                            >
                                <Input id='email'/>
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    { required: true, message: 'Mật khẩu không được để trống!' },
                                    {
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                        message: "Phải chứa ít nhất 1 kí tự thường, 1 kí tự hóa, chữ số và có độ dài >= 8"
                                    }
                                ]}
                            >
                                <Input.Password id='password'/>
                            </Form.Item>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Nhập lại mật khẩu"
                                name="confirmPassword"
                                rules={[
                                    { required: true, message: 'Mật khẩu nhập lại không được để trống!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject("Mật khẩu nhập lại không khớp");
                                        }
                                    })
                                ]}
                            >
                                <Input.Password id='confirmPassword'/>
                            </Form.Item>
                            {/* <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                            >
                                <Input />
                            </Form.Item> */}
                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button id='btn-submit' type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng ký
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Đã có tài khoản ?
                                <span>
                                    <Link to='/login' > Đăng Nhập </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default RegisterPage;