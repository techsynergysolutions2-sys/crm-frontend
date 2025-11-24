import React,{useState, useEffect,useMemo} from 'react'
import {Layout,Button, Badge,Card ,Col, Row,Typography ,Input,Select,List,Form,DatePicker,Modal,Table,Tooltip,Checkbox, 
    Progress,FloatButton,Avatar,notification } from 'antd';
import {DeleteOutlined, UploadOutlined,UsergroupAddOutlined, FileAddOutlined,MoreOutlined,EyeOutlined  } from '@ant-design/icons';
import { useNavigate,useLocation } from 'react-router-dom'
import {fnGetDirectData,fnCreateData, fnUpateData,project_priority,task_priority, Task_Workflow_Status,Project_Workflow_Status,fnGetData,fnFileURls } from '../../shared/shared';
import AuditTrail from '../../components/AuditTrail';

import { styled } from '@mui/material/styles';
import MButton from '@mui/material/Button';

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function Project() {

  const location = useLocation();
  const navigate = useNavigate();

  const [project, setProject] = useState(location.state)

  const [inviteModal, setInviteModal] = useState(false)
  const [filesModal, setFilesModal] = useState(false)
  const [auditModal, setAuditModal] = useState(false)
  const [checkListModal, setCheckListModal] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState([])
  const [invitedUsersUID, setInvitedUsersUID] = useState([])
  const [files, setFiles] = useState([])
  const [leaders, setLeaders] = useState([])
  const [clients, setClients] = useState([])
  const [tasks, setTasks] = useState([])
  const [perc, setPerc] = useState(0)
  const [api, contextHolder] = notification.useNotification();
  const [openAuidt, setOpenAudit] = useState(false)

  var companyid = sessionStorage.getItem('companyid')
  var usergroup = sessionStorage.getItem('usergroup')

  const fnGoBack = () => {
    navigate('/projects')
  }

  useEffect(() =>{
    // if(project != null || project != undefined){
    //   // setFiles(project?.files)
    // }

    getData()

  },[])

  const getData = async () => {

    let sql1 = `
              SELECT e.* FROM employees e 
              WHERE e.companyid = ${companyid} AND e.isactive = 1
              `
    try {
      const data = await fnGetDirectData('employees',sql1);
      const data2 = await fnGetData('clients',"clients", {companyid: companyid,isactive: 1}, { columns: '*'});
      setLeaders(data)
      setClients(data2)
    } catch (error) {
      
    }

    setPerc()

    if(JSON.stringify(project) != "{}"){
      setTasks([])
      setTasks(project.tasks)

      if(project.tasks.length > 0){
        let temp = project.tasks.filter((itm) => itm.status == 5)
        let calc = (temp.length / project.tasks.length) * 100
        
        setPerc(parseInt(calc))
      }else{
        setPerc(0)
      }
       

      setInvitedUsers([])
      for(let i = 0; i < project.invites.length; i++){
        project.invites[i]['fullname'] = `${project.invites[i]['firstname']} ${project.invites[i]['lastname']}`
        setInvitedUsers(itms => [...itms, project.invites[i] ])
        setInvitedUsersUID(itms => [...itms, project.invites[i]['id'] ])
      }
    }
  }

  const fnGetAttachments = async () => {
         
      let sql = `
                  SELECT a.uid,a.name,a.status,a.url FROM attachments a 
                  WHERE a.pageid = 6 AND a.recordid = ${project.id} AND a.isactive = 1`
      try {
      const data = await fnGetDirectData('attachments',sql);
      setFiles(data);
      } catch (error) {
      
      }
  
  };

  const getInviteUsers = async () =>{
    setInviteModal(true)
  }

  const columnsInvite = [
    {
      title: 'Full name',
      dataIndex: 'full_name',
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      render: (val) => <Typography style={{...Styles.text}}>{val}</Typography>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (val) => <Typography style={{...Styles.text}}>{val}</Typography>,
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      render: (record) => (
        <Tooltip title="Remove">
           <Button type="primary" icon={<DeleteOutlined />} style={{backgroundColor: 'red', marginLeft: 8}} onClick={() => fnRemoveInvite(record)}/>
        </Tooltip>
      ),
    },
  ];

  const columnsFiles = [
    {
      title: 'File name',
      dataIndex: 'name',
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      render: (record) => (
        <>
          <Tooltip title="View">
            <Button type="primary" icon={<EyeOutlined />} style={{backgroundColor: '#b7b7b7ff', marginLeft: 8}} onClick={() => fnViewFile(record)}/>
          </Tooltip>
          <Tooltip title="Remove">
            {
              usergroup = 1 || project.createdby ? (
                <Button type="primary" icon={<DeleteOutlined />} style={{backgroundColor: 'red', marginLeft: 8}} onClick={() => fnDeleteFile(record)}/>
              ):(
                <Button type="primary" disabled icon={<DeleteOutlined />} style={{backgroundColor: 'gray', marginLeft: 8}} />
              )
            }
          </Tooltip>
        </>
        
      ),
    },
  ];

  const fnCreateUpdateTask = () => {
    console.log("New task created")
  }

  const onFinish = (values) => {
    // values['invites'] = invitedUsersUID
    // values['duration'] = JSON.stringify(values['duration'])

    const fnSendData = async () => {
      // values['files'] = await fnFileURls(files)

      if(JSON.stringify(project) === "{}" ){
          values['companyid'] = sessionStorage.getItem('companyid')
          values['createdby'] = sessionStorage.getItem('uid')
          const data = await fnCreateData('projects',"projects", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
            console.log('success')
            let temp = values
            temp['id'] = data.insertId
            setProject(temp)
            api.success({
                title: ``,
                description: 'Project created successfully.',
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
      }else{
        values['id'] = project['id']
        values['updateby'] = sessionStorage.getItem('uid')
        const data = await fnUpateData('projects',"projects", values,'id = ? AND isactive = ?',[project['id'],1], 'update');
          if(data?.affectedRows > 0){
            api.success({
                title: ``,
                description: 'Order updated successfully.',
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

  const onFinishTask = (values) => {

    var companyid = sessionStorage.getItem('companyid')

    values['companyid'] = companyid
    values['createdby'] = sessionStorage.getItem('uid')
    values['status'] = 1
    values['project'] = project.id
    values['description'] = ''
    values['isactive'] = 1
    values['duedate'] = values['duedate']
    values['frm'] = 'project'

    const fnSendData = async () => {

      try {
        const data = await fnCreateData('tasks',"tasks", values, 'new');
        if(data.insertId != null || data.insertId != undefined){
            values['id'] = data.insertId
            values['photourl'] = data.userinfor[0]['photourl']
            values['fullname'] = data.userinfor[0]['full_name']
            setTasks(ts => [...ts, values])
            setCheckListModal(!checkListModal) 
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
    fnSendData()
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const fnCancelInviteModal = () => {
    setInviteModal(false)
  }

  const fnHandleSelectInvite = async (value) => {

    let dt = {
      projectid: project.id ,
      userid: value,
      createdby: sessionStorage.getItem('uid')
    }

    if(!invitedUsersUID.includes(value)){
      try {
        const data = await fnCreateData('projectinvites',"project_invites", dt, 'new');
        if(data?.length > 0){
          setInvitedUsers(us => [...us, data[0] ])
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

  };

  const fnRemoveInvite = async (record) => {

    try {
      let temp = {
        isactive: 0
      }
      const data = await fnUpateData('projectinvites',"project_invites", temp,'id = ? AND isactive = ?',[record['id'],1], 'update');
      if(data?.affectedRows == 1){
        setInvitedUsers((prevUsers) => prevUsers.filter((user) => user.id !== record.id));
        setInvitedUsersUID((idxs) => idxs.filter((id) => id !== record.id));
      }
      console.log(data)
    } catch (error) {
      
    }
  }

  const fnCancelFilesModal = () => {
    setFilesModal(false)
  }

  const fnHandleUploadFiles = (fls) => {
    if(fls.length == 0) return
    fnUploadAllPhotos(fls)
  };

  const fnCancelAuditModal = () => {
    setAuditModal(false)
  }

  const fnCancelChecklist = () => {
    setCheckListModal(false)
  }

  const fnUploadAllPhotos = async (fileList) => {
      try {
          let urls = await fnFileURls(fileList)
          for(let i = 0; i < urls.length; i++){

              let products = {
                  pageid: 6,
                  recordid: project['id'],
                  name: urls[i].name,
                  url: urls[i].url,
                  createdby: sessionStorage.getItem('uid'),
              }

              let data = await fnCreateData('attachments',"attachments", products, 'new');
              if(data.insertId != null || data.insertId != undefined){
                products['uid'] = data.insertId
                setFiles(fl => [...fl, products ])
              }else{
                api.warning({
                      title: ``,
                      description: 'Something went wrong trying to upload. Please try again.',
                      placement,duration: 2,
                      style: {
                      background: "#e2e2e2ff"
                      },
                });
              }
              
          }
      } catch (error) {
          let placement = 'topRight'
          api.warning({
              title: ``,
              description: 'Something went wrong trying to upload. Please try again.',
              placement,duration: 2,
              style: {
              background: "#e2e2e2ff"
              },
          });
      }
      

  }

  const fnViewFile = (record) => {
    window.open(record.url, '_blank');
  }

  const fnDeleteFileByName = (name) => {
    setFiles((sks) => sks.filter(sk => sk.name !== name));
  };

  const fnDeleteFile = async (file) =>{
         
      let values = {
          isactive: 0
      }
      try {
        const data = await fnUpateData('attachments',"attachments", values,'uid = ?',[file['uid']], 'update');
        if(data?.affectedRows > 0){
          fnDeleteFileByName(file['name'])
        }
      
      } catch (error) {
          let placement = 'topRight'
          api.warning({
              title: ``,
              description: 'Something went wrong. Please try again.',
              placement,duration: 2,
              style: {
              background: "#e2e2e2ff"
              },
          });
      }
  }


  const fnOpenAttachmentModal = async () =>{
    await fnGetAttachments()
    setFilesModal(true)
  }

  const fnShowAudit = (val) =>{
        setOpenAudit(val)
    }

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}

        {/* Audit */}
        <AuditTrail recid={project?.id} pageid={6} showhide={openAuidt} fnShowAudit={fnShowAudit}/>

    <Content style={{height: '100%',overflowY: 'scroll',scrollbarWidth: 'none'}}>

      {/* invite modal */}
      <Modal title="Invite" open={inviteModal} width={1000} onCancel={fnCancelInviteModal}
        maskClosable={false}
        footer={
          <Button onClick={fnCancelInviteModal}>
            Cancel
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
            allowClear={false} placeholder="Please select a user" onChange={(e) => fnHandleSelectInvite(e)}
            style={{ width: '40%'}}>
              { 
                leaders?.map((itm,key) => (
                  <Option key={key} value={itm?.id}>{itm?.firstname} {itm?.lastname}</Option>
                ))
              }
            </Select>
          </Col>
        </Row>
        
        <Row style={{marginTop: 40}}>
          <Col span={24}>
            <Table
              columns={columnsInvite}
              dataSource={invitedUsers}
              rowKey="id"
              showSorterTooltip={{
                target: 'sorter-icon',
              }}
            />
          </Col>
        </Row>
      </Modal>


       {/* files modal */}
       <Modal title="Files" open={filesModal} width={1000} onCancel={fnCancelFilesModal}
          maskClosable={false}
          footer={
            <Button onClick={fnCancelFilesModal}>
              Cancel
            </Button>
          }
        >
          <Row>
            <Col span={24}>
              <MButton
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<UploadOutlined />}
              >
                Upload files
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event) => fnHandleUploadFiles(event.target.files)}
                  multiple
                />
              </MButton>
            </Col>
          </Row>
          
          <Row style={{marginTop: 40}}>
            <Col span={24}>
              <Table
                columns={columnsFiles}
                dataSource={files}
                rowKey='uid'
                showSorterTooltip={{
                  target: 'sorter-icon',
                }}
              />
            </Col>
          </Row>
        </Modal>

        {/* add checklist / task */}
      <Modal title="Invite" open={checkListModal} width={1000} onCancel={fnCancelChecklist}
        maskClosable={false}
        footer={
          <Button onClick={fnCancelInviteModal}>
            Cancel
          </Button>
        }
      >
        <Row>
          <Col span={24}>
            <Form name="addtask" onFinish={onFinishTask} onFinishFailed={onFinishFailed} autoComplete="off" >
                              
                <Row>
                    <Col span={24}>
                        <Form.Item label="Title" name="title"
                        rules={[
                            {
                            required: true,
                            message: 'Please input title!',
                            },]} >
                        <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Form.Item label="Assign to" name="assignto" 
                        rules={[
                            {
                            required: true,
                            message: 'Please assign a task to a user!',
                            },
                        ]}>
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a user">
                        { 
                          leaders?.map((itm,key) => (
                            <Option key={key} value={itm?.id}>{itm?.firstname} {itm?.lastname}</Option>
                          ))
                        }
                        </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>            
                    <Col span={24}>
                        <Form.Item
                        name="priority"
                        label="Priority"
                        rules={[
                            {
                            required: true,
                            message: 'Please select a priority!',
                            },
                        ]}
                        >
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select a priority"
                          >
                            {
                              task_priority?.map((itm,key) => (
                                <Option key={key} value={itm.value}>{itm.label}</Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                <Col span={24}>
                    <Form.Item label="Due date" name="duedate" 
                    rules={[
                    {
                        required: true,
                        message: 'Please select a due date!',
                    },
                    ]}>
                    <input type="datetime-local" />
                    </Form.Item>
                </Col>
                </Row>

                <Form.Item label={null}>
                <Button type="primary" htmlType="submit" style={{}}>
                    Save
                </Button>
                </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>

      <Row style={{padding: 15, height: '100%'}}>
        <Col span={16}>
          <Card style={{ width: '100%', overflowY: 'scroll',scrollbarWidth: 'none', height: '98%'}}>
            <h2 style={{marginBottom: 40,marginTop: 20}}>Project</h2>
            <Row>
              <Col span={24}>
                <Form name="basic" initialValues={project} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
                  
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
                    <Col span={8} style={{paddingLeft: 15, marginTop: 40}}>
                        <Progress percent={perc} size="small" />
                    </Col>
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Created by</label>
                        <Form.Item name="createdby" >
                          <Select placeholder="" size='large' disabled>
                            {
                              leaders?.map((itm,key) => (
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
                        <label>Created by</label>
                        <Form.Item name="createddate" >
                          <input type="datetime-local" disabled />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Client</label>
                        <Form.Item
                          name="client"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a client!',
                            },
                          ]}
                        >
                          <Select allowClear={true} placeholder="Please select a client">
                            { 
                              clients?.map((itm,key) => (
                                <Option key={key} value={itm?.id}>{itm?.clientname}</Option>
                              ))
                            }
                          </Select>
                        </Form.Item>
                      </div>
                    </Col>
                    <Col span={4}></Col>
                    <Col span={10}>
                      <div className="form-group">
                        <Form.Item name="visibletoclient" valuePropName="checked" label={null}>
                            <Checkbox>Visible to client</Checkbox>
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
                          <Select allowClear={true} placeholder="Please select status">
                          {
                            Project_Workflow_Status?.map((itm,key) => (
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
                        <label>Budget</label>
                        <Form.Item name="budget"
                            rules={[
                            {
                                required: true,
                                message: 'Please input a budget!',
                            },]} >
                            <Input />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={10}>
                      <div className="form-group">
                        <label>Project Learder</label>
                        <Form.Item
                          name="leader"
                          rules={[
                            {
                              required: true,
                              message: 'Please select a project learder!',
                            },
                          ]}
                        >
                          <Select allowClear={true} placeholder="Please select a project learder">
                            { 
                              leaders?.map((itm,key) => (
                                <Option key={key} value={itm?.id}>{itm?.firstname} {itm?.lastname}</Option>
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
                          <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                          allowClear={true} placeholder="Please select a priority">
                            {
                                project_priority?.map((itm,key) => (
                                  <Option key={key} value={itm.value}>{itm.label}</Option>
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
                        <Form.Item name="duration" 
                        rules={[
                          {
                            required: true,
                            message: 'Please select a Duration!',
                          },
                        ]}>
                          <input type="datetime-local" />
                        </Form.Item>
                      </div>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col span={24}>
                      <Typography style={{...Styles.text}}>Notes</Typography>
                    </Col>
                  </Row>

                  <Row>
                    <Col span={24}>
                      <Form.Item label="" name="notes" >
                        <TextArea rows={6}  />
                      </Form.Item>
                    </Col>
                  </Row>


                  {/* <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" style={{backgroundColor: '#1092a7', color: '#fff'}}>
                      Save
                    </Button>
                    <Button type="default" onClick={() => fnGoBack()} style={{ marginLeft: 15}}>
                      Cancel
                    </Button>
                  </Form.Item> */}
                  <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                      Save Project
                  </button>
                  {
                      JSON.stringify(project) === "{}" ? (
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
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8} style={{paddingLeft: 20}}>
        <Card style={{ width: '100%',overflowY: 'scroll', height: '98%'}}>
          <Row>
            <Col span={16}>
              <Typography style={{...Styles.text}}>Tasks</Typography>
            </Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {JSON.stringify(project) == "{}" ? (null):(
                  <Button type="primary" onClick={() => setCheckListModal(true)}>Add</Button>
                )}
            </Col>
          </Row>
          <Row>
            {JSON.stringify(project) == "{}" ? (null):(
              <Col span={24}>
                {
                  tasks.length > 0 ? (
                    <List
                      dataSource={tasks}
                      renderItem={(item, index) => (
                        <Task item={item} index={index} key={index}/>
                      )}
                    />
                  ):(null)
                }
                
              </Col>
            )}
          </Row>

        </Card>
        </Col>
      </Row>

      <>
      {
        JSON.stringify(project) == "{}" ? (null):(
          <FloatButton.Group
          trigger="click"
          type="primary"
          style={{ insetInlineEnd: 24 }}
          icon={<MoreOutlined />}
        >
          <FloatButton onClick={() => getInviteUsers()} shape="circle" type="default" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="left" title={'Invite users'}><UsergroupAddOutlined /></Tooltip>} />
          <FloatButton onClick={() => fnOpenAttachmentModal()} shape="circle" type="default" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="left" title={'Files'}><FileAddOutlined /></Tooltip>} />
        </FloatButton.Group>
        )
      }
        
      </>

    </Content>
    </Context.Provider>
  )
}



function Task({item,index}) {

  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [fullname, setFullname] = useState(null)

  useEffect(() => {
    getData()
  },[])

  const getData = async () => {
    // var companyid = sessionStorage.getItem('companyid')
    // const data = await fnGetFilteredData("users", [["companyid", "==", companyid],["id", "==", item.assignto]]);
    const data2 = Task_Workflow_Status.filter(itm => itm.id === item.status)
    // let fname = `${data[0].firstname} ${data[0].lastname}`
    // setFullname(fname)
    // setUser(data[0])
    setStatus(data2[0])
  }

  return (
    <List.Item style={{position: 'relative'}}>
        <List.Item.Meta
            avatar={<Avatar src={item.photourl} />}
            title={item.fullname}
            description={item.title}
        />
        <div><span className={`status`} style={{background: `${status?.color}`, color: '#fff'}}>{status?.title}</span></div>
    </List.Item>
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

export default Project