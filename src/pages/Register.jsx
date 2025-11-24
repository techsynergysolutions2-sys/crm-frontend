import React,{useState, useEffect} from 'react'
import { Button, DatePicker, Form, Input,Card,Row,Col,Typography,Upload,message,Steps, InputNumber,Descriptions,Spin    } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {useNavigate, Outlet } from 'react-router-dom'
import { db,auth } from '../shared/firebase';
import {createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { collection, addDoc,Timestamp  } from 'firebase/firestore';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {url,fnCreateData,amou} from '../shared/shared'
import axios from 'axios';


const props = {
  beforeUpload: file => {
    const isPNG = file.type === 'image/png';
    if (!isPNG) {
      message.error(`${file.name} is not a png file`);
    }
    return isPNG || Upload.LIST_IGNORE;
  },
  onChange: info => {
    console.log(info.fileList);
  },
};

const steps = [
  {
    title: 'User',
    content: 'user-content',
  },
  {
    title: 'Company',
    content: 'company-content',
  },
  {
    title: 'Payment',
    content: 'Payment-content',
  },
];

const saltRounds = 10;

function Register() {

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);
  const [member, setMember] = useState(null)
  const [company, setCompany] = useState(null)
  const [payment, setPayment] = useState(null)
  const [paymentitems, setPaymentItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [companyCreated, setCompanyCreated] = useState(false)
  const [compId, setCompId] = useState(null)

  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fnNavLogin = () => {
    navigate('/login')
  };

  const items = steps.map(item => ({ key: item.title, title: item.title }));

  const onFinish = values => {

    if ('firstname' in values) {
      setMember(values)
      setCurrent(current + 1);
    }else if('companyname' in values){
      setCompany(values)
      var total = Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format((values['employee_count'] * amou) * 12) 
      var itms = [
        {
          label: 'Number of employees',
          children: values['employeesnumber'],
        },
        {
          label: 'Price per employee',
          span: 'filled', // span = 2
          children: '$4.99 usd',
        },
        {
          label: 'Total',
          span: 'filled', // span = 3
          children: `${total}`,
        },
      ];
      setPaymentItems(itms)

      fnCreateAuth()
      .then( async(result) => {
        console.log("User created successfully:", result);
        setCurrent(current + 1);
      })
      .catch((error) => {
        console.error("User creation failed:", error);
        // show error message
      });

    }

    console.log('Success:', values);
    
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

 const fnCreateAuth = () => {
  return new Promise(async (resolve, reject) => {
    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        member['email'],
        member['password']
      );

      const user = userCredential.user;
      // console.log(user.uid);

      // Update display name
      await updateProfile(user, {
        displayName: `${member['firstname']} ${member['lastname']}`
      });

      // Create employee data
      // console.log(member)
      
      // Create company data
      company['isactive'] = 0;

      const data2 = await fnCreateData('company', 'companies', company, 'new');
      let values = {
        companyid: data2.insertId,
        createdby: 0,
        title:'Administrator'
      }
      
      const data3 = await fnCreateData('groups',"user_groups", values, 'new');

      member['uid'] = user.uid
      member['groupid'] = data3.insertId
      member['companyid'] = data2.insertId
      const data = await fnCreateData('employees', 'employees', member, 'new');

      // Check if data was created successfully
      if (data.insertId != null && data.insertId !== undefined) {
        setCompanyCreated(true);
        setCompId(data2.insertId);
        // fnGoBack()
        resolve({
          user,
          employeeId: data.insertId,
          companyId: data2.insertId
        });
      } else {
        console.log('Something went wrong');
        reject(new Error('Data creation failed'));
      }

    } catch (error) {
      console.error(error);
      alert(error.message);
      reject(error);
    } finally {
      setLoading(false);
    }
  });
};


  const fnCreateCompany = async (uid) =>{
    company['createdby'] = uid
    company['isactive'] = 1

    const currdate = new Date().toISOString().slice(0, 16)
    const date = new Date(currdate);

    date.setUTCFullYear(date.getUTCFullYear() + 1);
    company['expirydate'] = date
    try {
      addDoc(collection(db, 'companies'), company)
      .then((docRef) => {
        fnCreateUser(docRef.id,uid)
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error adding document: ", error);
      });
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const fnCreateUser = async  (companyid,uid) =>{
    member['companyid'] = companyid
    member['isactive'] = 1
    member['groupid'] = 1
    member['createdby'] = 0
    member['createddate'] = Timestamp.now() 
    member['userid'] = uid
    member['lastpaid'] = Timestamp.now() 
    var dob = member['dob']?.toDate()
    member['dob'] = Timestamp.fromDate(dob)
    console.log(member)
    try {
      addDoc(collection(db, 'users'), member)
      .then((docRef) => {
        setLoading(false)
        navigate('/login')
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error adding document: ", error);
      });
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const createOrder = async () => {

    try {
        const res = await axios.post(`${url}/payments`, {
          amount: Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format((amou * company['employee_count']) * 12) , // you can make this dynamic
          action: 'orders'
        });
        return res.data.id;
      } catch (err) {
        console.error(err);
        setErrorMessage("Could not create PayPal order");
      }
    
  };

  const onApprove = async (data) => {
    console.log('onApprove')

    try {
      const res = await axios.post(
        `${url}/payments`,{action: 'capture',orderID: data.orderID, compid: compId}
      );
      if (res.data.status === "COMPLETED") {
        setSuccess(true);
        fnNavLogin()
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Payment failed");
    }
  };


  return (
    <Row>
      
      <Col span={24}>
        <Row justify="center" style={{marginTop: 40}}>
          <Steps current={current} items={items} style={{width: 800}}/>
        </Row>

        <Row justify="center" style={{marginTop: 40}}>
          {
            current === 0  && (
              <Card style={{ width: 600, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
                <Typography style={{textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 15}}>Administrator</Typography>
                <Form
                    name="administrator"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={member}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                  <div className="form-group">
                    <label>First name</label>
                    <Form.Item
                    name="firstname"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Last name</label>
                    <Form.Item
                    name="lastname"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Contact number</label>
                    <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please input your contact number!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Date of birth</label>
                    <Form.Item
                      name="dob"
                      rules={[{ required: true, message: 'Please input your date of birth!' }]}
                    >
                      <input type="datetime-local" />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <Form.Item
                    name="email"
                    rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please input your E-mail!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </div>

                  {/* <Form.Item label="Profile picture">
                    <Upload {...props}  maxCount={1} >
                      <Button icon={<UploadOutlined />}>Upload png, jpg only</Button>
                    </Upload>
                  </Form.Item> */}

                  <Form.Item label={null}>
                  <Row justify="center">
                    <div style={{ marginTop: 24 }}>
                      {current < steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                          Next
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit" onClick={() => message.success('Processing complete!')}>
                          Done
                        </Button>
                      )}
                      {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                          Previous
                        </Button>
                      )}
                    </div>
                  </Row>
                  </Form.Item>
                              
                
                </Form>
            
              </Card>
            )
          }

          {
            current === 1  && (
              <Card style={{ width: 600, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
                <Typography style={{textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 15}}>Company</Typography>
                <Form
                    name="company"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={company}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                  <div className="form-group">
                    <label>Company name</label>
                    <Form.Item
                    name="companyname"
                    rules={[{ required: true, message: 'Please input a company name!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <Form.Item
                    name="country"
                    rules={[{ required: true, message: 'Please input a country!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Contact number</label>
                    <Form.Item
                    name="phone"
                    rules={[{ required: true, message: 'Please input your contact number!' }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <Form.Item
                    name="email"
                    rules={[
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please input your E-mail!',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </div>

                  <div className="form-group">
                    <label>Number of employees</label>
                    <Form.Item
                      name="employee_count"
                      rules={[{type: 'number', min: 1, required: true, message: 'Please input number of employees. Min 1!' }]}
                    >
                      <InputNumber />
                    </Form.Item>
                  </div>

                  <Form.Item label={null}>
                  <Row justify="center">
                    <div style={{ marginTop: 24 }}>
                      {current < steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                          Submit
                        </Button>
                      )}
                      {/* {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit" onClick={() => message.success('Processing complete!')}>
                          Done
                        </Button>
                      )} */}
                      {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                          Previous
                        </Button>
                      )}
                    </div>
                  </Row>
                  </Form.Item>

                </Form>
              </Card>
            )
          }

          {
            current === 2  && (
              <Card style={{ width: 600, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}>
                <Typography style={{textAlign: 'center', fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 600, marginBottom: 15}}>Payment</Typography>
                
                <Descriptions bordered title="Payment" items={paymentitems} />
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    currency: "USD",
                    components: "buttons,hosted-fields,funding-eligibility",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={(err) => {
                      console.error(err);
                      setErrorMessage("An error occurred during payment.");
                    }}
                  />
                </PayPalScriptProvider>
                <Row justify="center">
                    <div style={{ marginTop: 24 }}>
                      {current < steps.length - 1 && (
                        <Button type="primary" htmlType="submit">
                          Next
                        </Button>
                      )}
                      {current === steps.length - 1 && (
                        <Button type="primary" htmlType="submit" onClick={() => fnCreateAuth()}>
                          Pay
                        </Button>
                      )}
                      {current > 0 && (
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                          Previous
                        </Button>
                      )}
                    </div>
                  </Row>
                  <Row justify="center" align="middle">
                    {/* <Spin tip="Loading" spinning={loading} size="large" style={{marginTop: 20}}></Spin> */}
                  </Row>
              </Card>
            )
          }
          
        </Row>

        <Row justify="center" style={{marginTop: 20, marginBottom: 20}}>
          <Button type="primary" onClick={() => fnNavLogin()}>
            Login
          </Button>
        </Row>

      </Col>
    </Row>
  )
}

export default Register