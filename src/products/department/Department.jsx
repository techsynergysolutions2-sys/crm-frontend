import React,{ useState, useEffect,useMemo } from 'react'
import {Layout,Col, Row,Button, Input, Card,Form,Radio,notification} from 'antd';
import { useLocation,useNavigate } from "react-router-dom";
import { fnCreateData,fnUpateData } from '../../shared/shared';


const { Content } = Layout;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function Department() {

    const location = useLocation();
    const navigate = useNavigate();

    const [client, setClient] =  useState(location.state)
    const [group, setGroup] = useState(location.state)
    const [api, contextHolder] = notification.useNotification();

    const fnGoBack = () => {
        navigate('/departments')
    }

     useEffect(() => {
    
      },[])

    const onFinish = (values) => {
        
        const fnSendData = async () => {
            if(JSON.stringify(group) === "{}" ){
                values['companyid'] = sessionStorage.getItem('companyid')
                values['createdby'] = sessionStorage.getItem('uid')
                try {
                  const data = await fnCreateData('departments',"departments", values, 'new');
                  if(data.insertId != null || data.insertId != undefined){
                    api.success({
                        title: ``,
                        description: 'Department created successfully.',
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
                const data = await fnUpateData('departments',"departments", values,'id = ?',[group['id']], 'update');
                if(data?.affectedRows > 0){
                  api.success({
                      title: ``,
                      description: 'Department updated successfully.',
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
                api.error({
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
        
        console.log('Success:', values);
    };
    
    const onFinishFailed = (errorInfo) => {
        api.warning({
            title: ``,
            description: 'Something went wrong. Please try again',
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
    <Content>
        <Row style={{padding: 15}}>
        <Col span={24}>
          <Card style={{ width: '100%', height: '100%'}}>
            <h1 className="dashboard-title">Department</h1>
            <Row>
              <Col span={24}>
                <Form name="group" preserve={false} initialValues={group} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                                              
                    <Row>
                        <Col span={16}>
                          <div className="form-group">
                            <label>Title</label>
                            <Form.Item name="title"
                              rules={[
                                  {
                                  required: true,
                                  message: 'Please input title!',
                                  },]} >
                            <Input />
                            </Form.Item>
                          </div>
                        </Col>
                        <Col span={2}></Col>
                        <Col span={6}>
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
    
                    <Form.Item label={null}>
                      <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
                          Save
                      </Button>
                      <Button type="button" className="btn btn-outline" onClick={() => fnGoBack()}>
                          Cancel
                      </Button>
                    </Form.Item>
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


export default Department