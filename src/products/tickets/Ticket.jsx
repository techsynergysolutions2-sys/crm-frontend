import React,{ useState, useEffect,useMemo } from 'react';
import {Button,Card ,Col, Row,Input,Select,Form,notification } from 'antd';
import {ticket_priority,ticket_status,fnGetData,fnGetDirectData,fnCreateData,fnUpateData } from '../../shared/shared'
import { useNavigate,useLocation } from 'react-router-dom'
import AuditTrail from '../../components/AuditTrail';

const { Option } = Select;
const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const Ticket = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(location.state)
  const [category, setCategory] = useState([])
  const [department, setDepartment] = useState([])
  const [employees, setEmployees] = useState([])
  const [notes, setNotes] = useState([])
  const [notesText, setNotesText] = useState('') 
  const [showNotes, setShowNotes] = useState(false)
  const [api, contextHolder] = notification.useNotification();
  const [openAuidt, setOpenAudit] = useState(false)

  var companyid = sessionStorage.getItem('companyid')

  useEffect(() => {
    fnGetDataLoad()
  },[])

  const fnGoBack = () => {
    navigate('/tickets')
  }

  const fnGetDataLoad = async () => {

    try {
      let sql = `
                SELECT e.* FROM employees e 
                WHERE e.companyid = ${companyid} AND e.isactive = 1
                `
      const data = await fnGetDirectData('employees',sql);
      const data2 = await fnGetData('ticketcategory',"ticket_category", {companyid: companyid,isactive: 1}, { columns: '*'});
      const data3 = await fnGetData('departments',"departments", {companyid: companyid,isactive: 1}, { columns: '*'});

      setEmployees(data)
      setCategory(data2)
      setDepartment(data3)
    } catch (error) {
      setEmployees([])
    }

    if(JSON.stringify(ticket) != "{}"){
        let sql = `
            SELECT tn.*, CONCAT(e.firstname, ' ', e.lastname) AS fullname FROM ticket_notes tn
            JOIN employees e
            ON tn.createdby = e.id 
            WHERE tn.ticketid = ${ticket['id']} AND tn.isactive = 1
        `
        const data3 = await fnGetDirectData('ticketnotes',sql);
        setShowNotes(true)
        setNotes(data3)
    }
    
    
  }

  const onFinish = (values) => {
  
    const fnSendData = async () => {

      if(JSON.stringify(ticket) === "{}" ){
          values['companyid'] = sessionStorage.getItem('companyid')
          values['createdby'] = sessionStorage.getItem('uid')

          const data = await fnCreateData('tickets',"tickets", values, 'new');
          if(data.insertId != null || data.insertId != undefined){
            setShowNotes(true)
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
      }else{
        values['id'] = ticket['id']
        values['updateby'] = sessionStorage.getItem('uid')
        const data = await fnUpateData('tickets',"tickets", values,'id = ? AND isactive = ?',[ticket['id'],1], 'update');
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

  }

  const onFinishFailed = (values) => {
  }

  const fnChangeNotesText = (e) => {
    setNotesText(e)
  }

  const fnSaveNotes = async () => {
    if(notesText == '' || notesText == null) return

    try {
        let values = {
            ticketid: ticket['id'],
            createdby: sessionStorage.getItem('uid'),
            createddate: new Date().toISOString().slice(0, 16),
            notes: notesText
        }
        const data = await fnCreateData('ticketnotes',"ticket_notes", values, 'new');
        if(data.insertId != null || data.insertId != undefined){
            values['id'] = data.insertId
            let user = employees.filter(e => e.id == sessionStorage.getItem('uid'))
            values['fullname'] = user[0]?.firstname + ' ' + user[0]?.lastname
            setNotes(itms => [...itms, values])
        }

    } catch (error) {
        
    }
  }

    const fnShowAudit = (val) =>{
        setOpenAudit(val)
    }

    const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}

        {/* Audit */}
        <AuditTrail recid={ticket?.id} pageid={7} showhide={openAuidt} fnShowAudit={fnShowAudit}/>

    <div className="container" style={{width: '100%', height: '100%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="card">
        <h2>Ticket</h2>
        <Form name="basic" initialValues={ticket} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off" >
          {/* Customer Info */}
            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label>Created by</label>
                        <Form.Item name="createdby">
                          <Select disabled
                          allowClear={true} placeholder="current user" size='large'>
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
                    <label>Date</label>
                        <Form.Item name="createddate">
                            <input type="datetime-local" disabled />
                        </Form.Item>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <div className="form-group">
                        <label>Priority</label>
                        <Form.Item name="priority"
                        rules={[
                            {
                            required: true,
                            message: 'Please select a priority!',
                            },
                        ]}
                        >
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a priority" size='large'>
                            {
                            ticket_priority?.map((itm,key) => (
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
                        <label>Status</label>
                        <Form.Item name="status" 
                        rules={[
                            {
                            required: true,
                            message: 'Please select a status!',
                            },
                        ]}>
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select a status" size='large'>
                            {
                            ticket_status?.map((itm,key) => (
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
                        <label>Department</label>
                        <Form.Item name="assignto" 
                        rules={[
                            {
                            required: true,
                            message: 'Please select an employee!',
                            },
                        ]}>
                        <Select showSearch filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())} 
                        allowClear={true} placeholder="Please select an employee" size='large'>
                            {
                            department?.map((itm,key) => (
                                <Option value={itm.id} key={key}>{itm.title}</Option>
                            ))
                            }
                        </Select>
                        </Form.Item>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                    
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <div className="form-group">
                        <label>Description</label>
                        <Form.Item name="description" >
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
                Save Ticket
            </button>
            {
                JSON.stringify(ticket) === "{}" ? (
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

        {
            showNotes == true ? (
                <>
                    <Row style={{width: '100%'}}>
                        <Col span={24}>
                            <Row>
                                <Col span={24}>
                                    <div className="form-group">
                                        <label>Notes</label>
                                            <TextArea rows={3} onChange={e => fnChangeNotesText(e.target.value)} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{width: '100%', marginTop: 5}}>
                        <Col span={24}>
                            <Row>
                                <Col span={22}></Col>
                                <Col span={2}>
                                    <Button type="primary" style={{backgroundColor: '#1092a7', color: '#fff'}} onClick={() => fnSaveNotes()}>
                                        Add notes
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 40}}>
                        <Col span={24}>
                            {
                            notes?.map((itm,key) => (
                                <Card title={itm['fullname']} key={key} style={{ width: '100%',marginTop: 15 }}>
                                    <p>{itm['notes']}</p>
                                    <p>{itm['createddate']?.replace('T', ' ')}</p>
                                </Card>
                            ))
                            }
                        </Col>
                    </Row>
                </>
            ):(null)
        }
        
      </div>
    </div>
    </Context.Provider>
  );
};

export default Ticket;