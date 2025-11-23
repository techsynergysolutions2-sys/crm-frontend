import React,{useState, useEffect,useRef,useMemo} from 'react'
import {Layout, Button, Card ,Col, Row,Typography ,Input,Select,Form,Table,Tooltip,Space,notification} from 'antd';
import { SearchOutlined,DeleteOutlined  } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useLocation,useNavigate } from "react-router-dom";
import { fnGetData,fnCreateData,fnUpateData } from '../../shared/shared';

const { Content } = Layout;
const { Option } = Select;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

function Employee() {

  const location = useLocation();
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState([])
  const [groups, setGroups] = useState([])
  const [skills, setSkills] = useState([])
  const [skill, setSkill] = useState('')
  const [achievements, setAchievement] = useState([])
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pass, setPass] = useState('')
  const [employee, Setemployee] =  useState(location.state)
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    
    fetchDepartment()
  },[])

  const fetchDepartment = async () => {
    var companyid = sessionStorage.getItem('companyid')
    try {
      const data = await fnGetData('departments',"departments", {companyid: companyid,isactive: 1}, { columns: '*'});
      const data2 = await fnGetData('groups',"user_groups", {companyid: companyid}, { columns: '*'});
      setDepartments(data);
      setGroups(data2)
    } catch (error) {
      
    }
    
    if(JSON.stringify(employee) != "{}" ){
      const data3 = await fnGetData('skills',"skills", {empid: employee['id'],isactive: 1}, { columns: '*'});
      setSkills(data3)
    }
  };

  const onFinish = async (values) => {

    if(JSON.stringify(employee) === "{}" ){
      try {
        values['companyid'] = sessionStorage.getItem('companyid')
        values['skills'] = skills
        values['isactive'] = 1
        const data = await fnCreateData('employees',"employees", values, 'new');
        if(data.insertId != null || data.insertId != undefined){
          fnAddSkills(data.insertId,skills)
          api.success({
              title: ``,
              description: 'Employee created successfully.',
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
        
      }
    }else{
      try {
        delete values['password']
        const data = await fnUpateData('employees',"employees", values,'id = ? AND isactive = ?',[employee['id'],1], 'update');
        if(data?.affectedRows > 0){
          api.success({
              title: ``,
              description: 'Employee updated successfully.',
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

  const fnGoBack = () => {
    navigate('/employees')
  }

  const searchInput = useRef(null);
  const getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
      filterDropdownProps: {
        onOpenChange(open) {
          if (open) {
            setTimeout(() => {
              var _a;
              return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
            }, 100);
          }
        },
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const skillscolumns = [
    Object.assign(
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        width: '90%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('title')
    ),
    Object.assign(
        {
      title: 'Action',
      key: 'operation',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <>
        <Tooltip title="Delete">
            <Button type="primary" onClick={() => fnDeleteSkill(record)} icon={<DeleteOutlined/>} style={{backgroundColor: '#fc4949', marginLeft: 8}}/>
        </Tooltip>
        </>
      ),
    },
    )
  ]

  const achievementscolumns = [
    Object.assign(
    {
        title: 'Name',
        dataIndex: 'title',
        key: 'title',
        width: '60%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('title')
    ),
    Object.assign(
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '30%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('status')
    ),
    Object.assign(
        {
      title: 'Action',
      key: 'operation',
      width: '10%',
      fixed: 'right',
      render: (record) => (
        <>
        <Tooltip title="Delete">
            <Button type="primary" icon={<DeleteOutlined/>} style={{backgroundColor: '#fc4949', marginLeft: 8}}/>
        </Tooltip>
        </>
      ),
    },
    )
  ]

  const fnAddSkills = async (recid,items) => {
    for(let i = 0; i < items.length; i++){
      try {
        let obj = {
          title: items[i].title,
          empid: recid,
          createdby: sessionStorage.getItem('uid')
        }
        await fnCreateData('skills',"skills", obj, 'new');
      } catch (error) {
        console.log(error)
      }
    }
  }

  const fnCheckSkillByTitle = (title) => {
    return skills.some(sks => sks.title === title);
  };

  const fnAddSkill = () =>{
    if (skill == '' || skill == null){
      alert('Please enter a skill')
      return
    }
    if(fnCheckSkillByTitle(skill)){
      alert('Skill already exist')
      return
    }
    var obj = {
      title: skill
    }
    if(JSON.stringify(employee) != "{}" ){
      let itm = [obj]
      fnAddSkills(employee['id'],itm)
    }
    setSkills(sks => [...sks, obj ])
    setSkill('')
  }

  const fnDeleteSkillByTitle = (title) => {
    setSkills((sks) => sks.filter(sk => sk.title !== title));
  };

  const fnDeleteSkill = async (record) =>{
    let values = {
      isactive: 0
    }

    fnDeleteSkillByTitle(record.title)

    if(JSON.stringify(employee) != "{}" ){
      try {
        const data = await fnUpateData('skills',"skills", values,'id = ?',[record['id']], 'update');
        // alert('Skill deleted')
      } catch (error) {
          // console.log(error)
      }
    }
    
  }

  const fnGetPassStr = (e) => {
    setPass(e)
  }

  const fnUpdatePassword = async () => {
  
    if(pass == ''){
      alert('Please enter a password')
      return
    }

    let values = {
      password: pass
    }
    try {
      const data = await fnUpateData('employees',"employees", values,'id = ?',[employee['id']], 'update');
      if(data?.affectedRows > 0){
        api.success({
              title: ``,
              description: 'Password updated successfully.',
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
    } catch (error) {
        // console.log(error)
    }
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <Content style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>

        <Row style={{padding: 15, height: '100%', overflowY: 'scroll',scrollbarWidth: 'none'}}>
        <Col span={24} style={{}}>
          <Card style={{width: '100%', height: '100%'}}>
            <h1 className="dashboard-title">Employee</h1>
            <Row>
              <Col span={24}>
                <Form
                  initialValues={employee}
                  layout="vertical"
                  onFinish={onFinish}
                  style={{ maxWidth: 800, margin: '0 auto' }}
                >
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="form-group">
                          <label>First name</label>
                          <Form.Item name="firstname" rules={[{ required: true,message: 'Please input first name!' }]}>
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Last name</label>
                          <Form.Item name="lastname" rules={[{ required: true,message: 'Please input last name!' }]}>
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Email</label>
                          <Form.Item name="email" rules={[{ required: true, type: 'email',message: 'Please input email!'  }]}>
                            <Input placeholder="e.g., sarah@company.com" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Password</label>
                          <Row>
                            <Col span={14} style={{marginRight: 20}}>
                              <Input.Password  size='large' onChange={ e => fnGetPassStr(e.target.value)}/>
                            </Col>
                            <Col span={6}>
                              { JSON.stringify(employee) === "{}" ? (null):(
                                <Button onClick={() => fnUpdatePassword()}>
                                  Update Password
                                </Button>
                              )}
                              
                            </Col>
                          </Row>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Phone Number</label>
                          <Form.Item name="phone" rules={[{ required: true,message: 'Please input phone number!'  }]} >
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Date of birth</label>
                          <Form.Item name="dob" >
                            <input type="datetime-local" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Department</label>
                          <Form.Item name="department" rules={[{ required: true,message: 'Please input Department!'  }]}>
                            <Select size='large' showSearch allowClear={true} filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}  placeholder="Select department">
                              {
                                departments?.map((itm,key) => (
                                  <Option key={key} value={itm?.id}>{itm?.title}</Option>
                                ))
                              }
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Job Title / Role</label>
                          <Form.Item name="role">
                            <Input placeholder="e.g CRM Manager" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Start Date</label>
                          <Form.Item name="startdate">
                            <input type="datetime-local" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Employment Type</label>
                          <Form.Item name="employmenttype">
                            <Select placeholder="Choose type" size='large'>
                              <Option value={1}>Full-Time</Option>
                              <Option value={2}>Part-Time</Option>
                              <Option value={3}>Contractor</Option>
                              <Option value={4}>Intern</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Employee Status</label>
                          <Form.Item name="status">
                            <Select size='large'>
                              <Option value={1}>Active</Option>
                              <Option value={2}>On Leave</Option>
                              <Option value={3}>Training</Option>
                              <Option value={4}>Suspended</Option>
                              <Option value={5}>Terminated</Option>
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Working hours</label>
                          <Form.Item name="workinghours">
                            <Input placeholder="e.g 8am - 16pm" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Home address</label>
                          <Form.Item name="address">
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>City / State</label>
                          <Form.Item name="city">
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Country</label>
                          <Form.Item name="country">
                            <Input placeholder="" />
                          </Form.Item>
                        </div>
                      </Col>

                      <Col span={12}>
                        <div className="form-group">
                          <label>Group</label>
                          <Form.Item name="groupid" rules={[{ required: true,message: 'Please select group!'  }]}>
                            <Select size='large' showSearch allowClear={true} filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}  placeholder="Select department">
                              {
                                groups?.map((itm,key) => (
                                  <Option key={key} value={itm?.id}>{itm?.title}</Option>
                                ))
                              }
                            </Select>
                          </Form.Item>
                        </div>
                      </Col>

                        <Col span={24}>
                          <Typography style={{...Styles.text, fontSize: 18}}>Emergency contact</Typography>
                        </Col>

                        <Col span={12}>
                          <div className="form-group">
                            <label>Name</label>
                            <Form.Item name="contactname">
                              <Input placeholder="" />
                            </Form.Item>
                          </div>
                        </Col>

                        <Col span={12}>
                          <div className="form-group">
                            <label>Phone NO.</label>
                            <Form.Item name="contactphone">
                              <Input placeholder="" />
                            </Form.Item>
                          </div>
                        </Col>

                        <Col span={24}>
                          <Typography style={{...Styles.text, fontSize: 18}}>Skills</Typography>
                        </Col>

                        <Col span={16}>
                          <div className="form-group">
                            <Input placeholder="" defaultValue={skill} onChange={ e => setSkill(e.target.value.trim())} />
                          </div>
                        </Col>

                        <Col span={8} style={{ textAlign: 'left' }}>
                          <Button onClick={fnAddSkill}>
                            Add skill
                          </Button>
                        </Col>

                        {
                          skills.length > 0 ? (
                            <Col span={24} style={{ marginTop: 10 }}>
                              <Table rowKey="title" columns={skillscolumns} dataSource={skills}/>
                            </Col>
                          ):(null)
                        }

                        {
                          achievements.length > 0 ? (
                          <>
                            <Col span={24}>
                              <Typography style={{...Styles.text, fontSize: 18}}>Achievements</Typography>
                            </Col>
                            <Table rowKey="id" columns={achievementscolumns} dataSource={achievements}/>
                          </>
                          ):(null)
                        }

                      <Col span={24} style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button type="primary" htmlType="submit">
                          Save Employee
                        </Button>
                      </Col>
                  </Row>
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

export default Employee