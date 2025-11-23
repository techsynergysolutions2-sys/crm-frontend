import {useEffect} from 'react';
import { Button, Checkbox, Form, Input,Card,Row,Typography } from 'antd';
import {useNavigate, Outlet } from 'react-router-dom'
import {auth } from '../shared/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import {  fnGetData,fnGetDirectData } from '../shared/shared';

import { useStateValue } from '../data/StateProvider';

function Login(){

    const navigate = useNavigate();
    const [{}, dispatch] = useStateValue();
    const user_c = {
        username: 'jongisizwe66@gmail.com',
        password: 'Junior980417'
    }

    const fnNavRegister = () => {
        navigate('/register')
    }

    useEffect(() => {
        sessionStorage.setItem('companyid',null)
        sessionStorage.setItem('department',null)
        sessionStorage.setItem('photourl',null)
        sessionStorage.setItem('firstname',null)
        sessionStorage.setItem('lastname',null)
        sessionStorage.setItem('email',null)
        sessionStorage.setItem('uid',null)
    },[])

    const onFinish = async values => {

        try {
            const data = await fnGetData('login',"", {email: values['username'], password: values['password']}, { columns: '*'});
            console.log(data)
            if(data.code == 200){
                console.log('check 0')
                let sq = `
                    SELECT e.id,e.firstname,e.lastname,e.email,e.companyid,e.department,e.groupid,e.photourl
                    FROM employees e
                    JOIN companies c
                    ON e.companyid = c.id
                    WHERE c.isactive = 1 AND e.id = '${data.userid}' AND e.isactive = 1
                    LIMIT 1;
                `
                try {
                    const data = await fnGetDirectData('employees',sq);
                    if(data.length > 0){
                        console.log('check 2')
                        let sql = `
                                SELECT gp.*,ug.title 
                                FROM group_permissions gp
                                JOIN user_groups ug
                                ON gp.id = ug.id
                                WHERE gp.companyid = ${data[0].companyid} AND groupid = ${data[0].groupid}
                                `
                        const data2 = await fnGetDirectData('orders',sql);
                        sessionStorage.setItem('companyid',data[0].companyid)
                        sessionStorage.setItem('department',data[0].department)
                        sessionStorage.setItem('photourl',data[0].photourl)
                        sessionStorage.setItem('firstname',data[0].firstname)
                        sessionStorage.setItem('lastname',data[0].lastname)
                        sessionStorage.setItem('email',data[0].email)
                        sessionStorage.setItem('uid',data[0].id)
                        let groupid = data[0].groupid
                        console.log('check 3')
                        if(groupid != 1){
                            sessionStorage.setItem('permissions',data2[0].permissions)
                        }else{
                            sessionStorage.setItem('permissions',0)
                        }
                        sessionStorage.setItem('groupid',data[0].groupid)
                        navigate('/tasklist')
                    }else{
                        alert('Incorrect username or password')
                    }
                } catch (error) {
                    console.log(error)
                }


            }else{
                alert('Invalid email or password')
            }
        } catch (error) {
            
        }

      };
      const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
      };

    return(
        <Row justify="center" align="middle" style={{height: "100vh"}}>
        <Card style={{ width: 600, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
            <Typography style={{textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 15}}>Orbit CRM</Typography>
            <Form
                initialValues={user_c}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
            <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
            >
            <Input />
            </Form.Item>

            <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            >
            <Input.Password />
            </Form.Item>

            {/* <Form.Item name="remember" valuePropName="checked" label={null}>
            <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
                Login
            </Button>
            <Button style={{marginLeft: 15}} onClick={() => fnNavRegister()}>
                Create account
            </Button>
            </Form.Item>
            </Form>
        </Card>
    </Row>
    )
};

export default Login;