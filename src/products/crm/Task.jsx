import React,{useState,useEffect,useMemo} from 'react'
import {Layout, Button, Badge,Card ,Col, Row,Typography ,Input,Select,List,Form,Space,notification    } from 'antd';
import { useNavigate,useLocation } from 'react-router-dom'
import { Task_Workflow_Status,task_priority,fnGetDirectData,fnCreateData,fnUpateData } from '../../shared/shared';

import SentCard from './components/SentCard';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

function Task() {

  const location = useLocation();
  const navigate = useNavigate();
  const [task, setTask] = useState(location.state)
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [noteInput, setNoteInput] = useState(null)
  const [notes, setNotes] = useState([])
  const [api, contextHolder] = notification.useNotification();

  var companyid = sessionStorage.getItem('companyid')

  const fnGoBack = () => {
    navigate('/tasklist')
  }


  useEffect(() => {
    fnGetDataLoad()
  },[])

  const fnGetDataLoad = async () => {

    try {
      let sql1 = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
      const data = await fnGetDirectData('employees',sql1);

      let sql = `SELECT * FROM projects WHERE companyid = ${companyid} AND isactive = 1`
      const data2 = await fnGetDirectData('projects',sql);

      setEmployees(data)
      setProjects(data2)
    } catch (error) {
      setEmployees([])
      setProjects([])
      console.log(error)
    }

    if(JSON.stringify(task) != "{}"){
      setNotes(task.notes)
    }

    
  }

  const onFinish = (values) => {

    var companyid = sessionStorage.getItem('companyid')
    
    values['companyid'] = companyid
    values['createdby'] = sessionStorage.getItem('uid')
    values['isactive'] = 1
    values['frm'] = 'task'

    const fnSendData = async () => {

      if(JSON.stringify(task) === "{}" ){
        try {
          const data = await fnCreateData('tasks',"tasks", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
              values['id'] = data.insertId
              setTask(values)
              api.success({
                title: ``,
                description: 'Task created successfully.',
                placement,duration: 2,
                style: {
                    background: "#e2e2e2ff"
                },
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
        values['id'] = task['id']
        const data = await fnUpateData('tasks',"tasks", values,'id = ? AND isactive = ?',[task['id'],1], 'update');
        if(data?.affectedRows > 0){
          api.success({
              title: ``,
              description: 'Task updated successfully.',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
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

  const fnSubmitNotes = async () => {
    if(noteInput == null || noteInput.trim() == '') return

    try {
      let values = {
        taskid: task.id,
        notes: noteInput.trim()
      }
      const data = await fnCreateData('tasknotes',"task_notes", values, 'new');
      if(data.insertId != null || data.insertId != undefined){
          setNotes(ts => [...ts, values])
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
      
    }

  }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <Content style={{height: '100%',overflowY: 'scroll',scrollbarWidth: 'none'}}>

      <Row style={{padding: 15, height: '100%'}}>
        <Col span={16}>
          <Card style={{ width: '100%', overflowY: 'scroll',scrollbarWidth: 'none',height: '98%'}}>
            <h2 style={{marginBottom: 40,marginTop: 20}}>Task</h2>
            <Row>
              <Col span={24}>
                <Form name="basic" initialValues={task} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                  
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
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Created by</label>
                        <Form.Item name="createdby" >
                          <Select placeholder="" size='large' disabled>
                            {
                              employees?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm?.firstname} {itm?.lastname}</Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Created date</label>
                        <Form.Item name="createddate" >
                          <input type="datetime-local" disabled />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Status</label>
                        <Form.Item
                          name="status"
                          rules={[
                            {
                              required: true,
                              message: 'Please select status!',
                            },
                          ]}
                        >
                          <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select status" size='large'>
                          {
                            Task_Workflow_Status?.map((itm,key) => (
                              <Option value={itm.id} key={key}>
                                <Badge color={itm.color} text={itm.title} />
                              </Option>
                            ))
                          }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Assign to</label>
                        <Form.Item name="assignto" 
                          rules={[
                            {
                              required: true,
                              message: 'Please assign a task to a user!',
                            },
                          ]}>
                          <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select a user" size='large'>
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
                    <Col span={10}>
                      <div className="form-group">
                        <label>Project</label>
                        <Form.Item
                          name="project"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a project!',
                            },
                          ]}
                        >
                          <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select a project" size='large'>
                            {
                                projects.map((itm,key) => (
                                  <Option value={itm.id} key={key}>{itm?.title}</Option>
                                ))
                              }
                          </Select>
                          
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Priority</label>
                        <Form.Item
                          name="priority"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a priority!',
                            },
                          ]}
                        >
                          <Select 
                          allowClear={true} placeholder="Please select a priority" size='large'>
                            {
                              task_priority?.map((itm,key) => (
                                <Option value={itm.value} key={key}>{itm.label}</Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Due date</label>
                        <Form.Item name="duedate" 
                        rules={[
                          {
                            required: true,
                            message: 'Please select a due date!',
                          },
                        ]}>
                          <input type="datetime-local" />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col span={24}>
                      <Typography style={{...Styles.text}}>Description</Typography>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item label="" name="description" >
                        <TextArea rows={5}  />
                      </Form.Item>
                    </Col>
                  </Row>


                  <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
                      Save
                    </Button>
                    <Button type="default" onClick={() => fnGoBack()} style={{ marginLeft: 15}}>
                      Cancel
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8} style={{paddingLeft: 20}}>
        <Card style={{ width: '100%', height: '98%', position: 'relative'}}>
          <Row>
            <Col span={24}>
              <Typography style={{...Styles.text}}>Notes</Typography>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <List
                dataSource={notes}
                renderItem={(item, index) => (
                  <SentCard item={item} index={index} key={index}/>
                )}
              />
            </Col>
          </Row>

          <Row style={{position: 'absolute', bottom: 10, width: '90%'}}>
            {
              JSON.stringify(task) == "{}" ? (null):(
                <Col span={24}>
                  <Space.Compact style={{width: '100%',}}>
                    <Input placeholder='message' onChange={e => setNoteInput(e.target.value)} />
                    <Button type="primary" onClick={() => fnSubmitNotes()}>Submit</Button>
                  </Space.Compact>
                </Col>
              )
            }
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

export default Task