import React,{ useState, useEffect,useMemo } from 'react';
import {Button,Col, Row,Input,Select,Form,notification  } from 'antd';
import {leave_type,leave_status,fnGetDirectData,fnCreateData,fnUpateData } from '../../shared/shared'
import { useNavigate,useLocation } from 'react-router-dom'
import AuditTrail from '../../components/AuditTrail';

const { Option } = Select;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const LeaveForm = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [leave, setleave] = useState(location.state)
  const [employees, setEmployees] = useState([])
  const [api, contextHolder] = notification.useNotification();
  const [openAuidt, setOpenAudit] = useState(false)

  var companyid = sessionStorage.getItem('companyid')

  useEffect(() => {
    fnGetDataLoad()
  },[])

  const fnGoBack = () => {
    navigate('/leaves')
  }

  const fnGetDataLoad = async () => {

    try {
      let sql = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
      const data = await fnGetDirectData('employees',sql);

      setEmployees(data)
    } catch (error) {
      setEmployees([])
      // console.log(error)
    }
    
  }

  const onFinish = (values) => {
  
    const fnSendData = async () => {

      if(JSON.stringify(leave) === "{}" ){
          values['companyid'] = sessionStorage.getItem('companyid')
          values['createdby'] = sessionStorage.getItem('uid')

          const data = await fnCreateData('leaves',"leaves", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
            api.success({
                title: ``,
                description: 'Leave created successfully.',
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
      }else{
        values['id'] = leave['id']
        values['updateby'] = sessionStorage.getItem('uid')
        const data = await fnUpateData('leaves',"leaves", values,'id = ? AND isactive = ?',[leave['id'],1], 'update');
        if(data?.affectedRows > 0){
          api.success({
              title: ``,
              description: 'Leave updated successfully.',
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
      }
    }

    fnSendData()

  }

  const onFinishFailed = (values) => {
  }

  const fnShowAudit = (val) =>{
        setOpenAudit(val)
    }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}

    {/* Audit */}
    <AuditTrail recid={leave?.id} pageid={8} showhide={openAuidt} fnShowAudit={fnShowAudit}/>

    <div className="container" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="card">
        <h2>Leave form</h2>
        <Form name="basic" initialValues={leave} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
          {/* Customer Info */}
            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label>Employee</label>
                        <Form.Item name="employee" 
                          rules={[
                            {
                              required: true,
                              message: 'Please select an employee!',
                            },
                          ]}>
                          <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select a employee" size='large'>
                            {
                              employees?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm?.firstname} {itm?.lastname}</Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label>Status</label>
                    <Form.Item name="status"
                    rules={[
                        {
                        required: true,
                        message: 'Please select a status!',
                        },
                    ]}
                    >
                    <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                    allowClear={true} placeholder="Please select a status" size='large'>
                        {
                        leave_status?.map((itm,key) => (
                            <Option value={itm.id} key={key}>{itm.label}</Option>
                        ))
                        }
                    </Select>
                    </Form.Item>
                </div>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label>Leave type</label>
                        <Form.Item name="leavetype"
                        rules={[
                            {
                            required: true,
                            message: 'Please select a leave type!',
                            },
                        ]}
                        >
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a leave type" size='large'>
                            {
                            leave_type?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm.label}</Option>
                            ))
                            }
                        </Select>
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label>Supervisor</label>
                    <Form.Item name="supervisor" 
                      rules={[
                        {
                          required: true,
                          message: 'Please select a supervisor!',
                        },
                      ]}>
                      <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                      allowClear={true} placeholder="Please select a supervisor" size='large'>
                        {
                          employees?.map((itm,key) => (
                            <Option value={itm.id} key={key}>{itm?.firstname} {itm?.lastname}</Option>
                          ))
                        }
                      </Select>
                    </Form.Item>
                </div>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label>Start date</label>
                        <Form.Item name="startdate" 
                        rules={[
                        {
                            required: true,
                            message: 'Please select a start Date!',
                        },
                        ]}>
                          <input type="datetime-local" />
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    <div className="form-group">
                    <label>End Date</label>
                    <Form.Item name="enddate" 
                    rules={[
                    {
                        required: true,
                        message: 'Please select a end Date!',
                    },
                    ]}>
                      <input type="datetime-local" />
                    </Form.Item>
                </div>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="form-group">
                        <label>Reason for Leave</label>
                        <Form.Item name="leavereason" >
                            <TextArea rows={3}  />
                        </Form.Item>
                    </div>
                </Col>
            </Row>

          {/* <Form.Item label={null}>
            <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
              Submit
            </Button>
            <Button type="default" onClick={() => fnGoBack()} style={{ marginLeft: 15}}>
              Cancel
            </Button>
          </Form.Item> */}

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                  Save Leave
              </button>
              {
                  JSON.stringify(leave) === "{}" ? (
                      null
                  ):(
                      <button type="button" className="btn btn-secondary" onClick={() => fnShowAudit(true)}>
                          Audit
                      </button>
                  )
              }
              <button type="button" className="btn btn-light" onClick={() => fnGoBack()}>
                  Cancel
              </button>
              </div>

        </Form>
      </div>
    </div>
    </Context.Provider>
  );
};

export default LeaveForm;