import React,{useState, useEffect,useMemo } from 'react'
import {Layout,Col, Row,Button, Input, Typography, Card,Select,Form,Radio,notification   } from 'antd';
import { useLocation,useNavigate } from "react-router-dom";
import { fnCreateData,fnUpateData } from '../../shared/shared';


const { Content } = Layout;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function Client() {

    const location = useLocation();
    const navigate = useNavigate();

    const [client, setClient] =  useState(location.state)
    const [api, contextHolder] = notification.useNotification();

    const fnGoBack = () => {
        navigate('/clients')
    }

     useEffect(() => {
    
      },[])

    const onFinish = (values) => {
        const fnSendData = async () => {
            if(JSON.stringify(client) === "{}" ){
                values['companyid'] = sessionStorage.getItem('companyid')
                values['createdby'] = sessionStorage.getItem('uid')
                try {
                  const data = await fnCreateData('clients',"clients", values, 'new');
                  if(data.insertId != null || data.insertId != undefined){
                    api.success({
                        title: ``,
                        description: 'Client created successfully.',
                        placement,duration: 2,
                        style: {
                            background: "#e2e2e2ff"
                        },
                        onClose: () => {
                            fnGoBack()
                        }
                    });
                  }else{
                    api.error({
                        title: ``,
                        description: 'Something went wrong. Please try again',
                        placement,duration: 2,
                        style: {
                            background: "#e2e2e2ff"
                        },
                    });
                  }
                } catch (error) {
                  api.error({
                      title: ``,
                      description: 'Something went wrong. Please try again',
                      placement,duration: 2,
                      style: {
                          background: "#e2e2e2ff"
                      },
                  });
                }
            }else{
              try {
                const data = await fnUpateData('clients',"clients", values,'id = ? AND isactive = ?',[client['id'],1], 'update');
                if(data?.affectedRows > 0){
                  api.success({
                      title: ``,
                      description: 'Client updated successfully.',
                      placement,duration: 2,
                      style: {
                          background: "#e2e2e2ff"
                      },
                      onClose: () => {
                          fnGoBack()
                      }
                  });
                }else{
                  api.warning({
                      title: ``,
                      description: 'Something went wrong. Please try again',
                      placement,duration: 2,
                      style: {
                      background: "#e2e2e2ff"
                      },
                  });
                }
              } catch (error) {
                api.warning({
                    title: ``,
                    description: 'Something went wrong. Please try again',
                    placement,duration: 2,
                    style: {
                    background: "#e2e2e2ff"
                    },
                });
              }
                
            }
            
        }
    
        fnSendData()
        
    };
    
    const onFinishFailed = (errorInfo) => {
        api.warning({
            title: ``,
            description: 'Please complete the required fields.',
            placement,duration: 2,
            style: {
            background: "#e2e2e2ff"
            },
        });
    };
        
    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <Content style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
        <Row style={{padding: 15}}>
        <Col span={24}>
          <Card style={{ width: '100%', height: '98%'}}>
            <h1 className="dashboard-title">Client</h1>
            <Row>
              <Col span={24}>
                <Form name="basic" initialValues={client} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                  
                  <Row>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Client Name</label>
                        <Form.Item name="clientname"
                        rules={[
                          {
                            required: true,
                            message: 'Please input client Name!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Email</label>
                        <Form.Item name="clientemail"
                        rules={[
                          {
                            required: true,
                            message: 'Please input client email!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Phone number</label>
                        <Form.Item name="clientphonenumber"
                        rules={[
                          {
                            required: true,
                            message: 'Please input client phone number!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                  </Row>

                   <Row>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Company Name</label>
                        <Form.Item name="companyname"
                        rules={[
                          {
                            required: false,
                            message: '',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Website</label>
                        <Form.Item name="website"
                        rules={[
                          {
                            required: false,
                            message: '',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Contact method</label>
                        <Form.Item name="contactmethod"
                        rules={[
                          {
                            required: true,
                            message: 'Please select preferred contact method!',
                          },]} >
                            <Select allowClear>
                              <Select.Option value={1}>Phone Call</Select.Option>
                              <Select.Option value={2}>Email</Select.Option>
                            </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                          <Typography style={{...Styles.text, fontSize: 18}}>Location</Typography>
                    </Col>
                  </Row>

                  <Row style={{marginTop: 15}}>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Country</label>
                        <Form.Item name="country"
                        rules={[
                          {
                            required: true,
                            message: 'Please input country!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>City</label>
                        <Form.Item name="city"
                        rules={[
                          {
                            required: true,
                            message: 'Please input city!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Street address</label>
                        <Form.Item name="streetaddress"
                        rules={[
                          {
                            required: true,
                            message: 'Please input street address!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                          <Typography style={{...Styles.text, fontSize: 18}}>Key Contact</Typography>
                    </Col>
                  </Row>

                  <Row style={{marginTop: 15}}>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Name</label>
                        <Form.Item name="contactname"
                        rules={[
                          {
                            required: true,
                            message: 'Please input primary contact name!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Role</label>
                        <Form.Item name="role"
                        rules={[
                          {
                            required: true,
                            message: 'Please input role!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Email</label>
                        <Form.Item name="contactemail"
                        rules={[
                          {
                            required: true,
                            message: 'Please input email!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                  </Row>

                  <Row>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Phone no.</label>
                        <Form.Item name="contactphone"
                          rules={[
                          {
                            required: true,
                            message: 'Please input Phone no.!',
                          },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={7}>
                      <div className="form-group">
                        <label>Active</label>
                        <Form.Item name="isactive" rules={[
                            {
                            required: true,
                            message: 'Please select active!',
                            },]}>
                          <Radio.Group>
                              <Radio value={0}> No </Radio>
                              <Radio value={1}> Yes </Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                        <Typography style={{...Styles.text, fontSize: 18}}>Notes</Typography>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item label="" name="notes" >
                        <TextArea rows={3}  />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
                      Save
                    </Button>
                    <Button type="button" className="btn btn-outline" onClick={() => fnGoBack()}>
                        Cancel
                    </Button>
                  </Form.Item> */}

                    <div className="form-actions" style={{marginBottom: 15}}>
                    <button type="submit" className="btn btn-primary">
                        Save Client
                    </button>
                    <button type="button" className="btn btn-light" onClick={() => fnGoBack()}>
                        Cancel
                    </button>
                    </div>

                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
        
      </Row>
    </Content>
    </Context.Provider>
  )
}

const Styles = {
  btn: {
      marginLeft: 10,
      marginTop: '-10px'
  },
  text: {
    fontFamily: "'Poppins', sans-serif",
  }
}


export default Client