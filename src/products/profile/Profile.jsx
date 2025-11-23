import React,{useState, useEffect,useRef} from 'react'
import {Layout, Button, Badge,Card ,Col, Row,Typography ,Input,Select,Skeleton,Form,DatePicker,Modal,Table,Tooltip,message,Space,Checkbox, 
    Progress   } from 'antd';
import dayjs from 'dayjs';
import { EditOutlined,SearchOutlined,PlusOutlined,DeleteOutlined  } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useLocation,useNavigate } from "react-router-dom";
import { fnUploadFile, fnGetData,fnFileURls,fnCreateData,fnGetDirectData, fnUpateData } from '../../shared/shared';
import { db,auth } from '../../shared/firebase';
import {createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import {Timestamp  } from 'firebase/firestore';
import { Building2, Mail, Phone, MapPin, Globe, Users, Upload, Save } from 'lucide-react';

const { Header, Content } = Layout;
const { Option } = Select;

function Profile() {

  const location = useLocation();
  const navigate = useNavigate();
  
  const [departments, setDepartments] = useState([])
  const [groups, setGroups] = useState([])
  const [skills, setSkills] = useState([])
  const [achievements, setAchievement] = useState([])
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [photourl, setPhotoUrl] =  useState('')
  const [employee, setEmployee] =  useState(null)
  const [pass, setPass] = useState('')

  useEffect(() => {
    
    fetchDepartment()
    fnGetEmployeeData()
  },[])

  const fetchDepartment = async () => {
    var companyid = sessionStorage.getItem('companyid')
    const data = await fnGetData('departments',"departments", {companyid: companyid,isactive: 1}, { columns: '*'});
    const data2 = await fnGetData('groups',"user_groups", {companyid: companyid}, { columns: '*'});
    setDepartments(data);
    setGroups(data2)
  };

  const fnGetEmployeeData = async () => {

    var companyid = sessionStorage.getItem('companyid')
    var uid = sessionStorage.getItem('uid')
    let sql = `
                SELECT e.id,e.firstname,e.lastname,e.email,e.phone,e.dob,e.department,e.role,e.startdate,e.employmenttype,e.status,e.workinghours,e.address,e.city,e.country,e.contactname,e.contactphone,e.createdby,e.createddate,e.companyid,e.photourl,e.isactive,e.groupid,d.title FROM employees e 
                LEFT JOIN departments d
                ON e.department = d.id
                WHERE e.companyid = ${companyid} AND e.isactive = 1 AND e.id = ${uid}
                `
    try {
    const data = await fnGetDirectData('employees',sql);
    const data2 = await fnGetData('skills',"skills", {empid: uid,isactive: 1}, { columns: '*'});
    setSkills(data2)
    setEmployee(data[0]);
    setPhotoUrl(data[0].photourl)
    } catch (error) {
        console.log(error)
    }

  }

  const onFinish = async (values) => {
    console.log('checking 0')
    try {
      console.log('checking 1')
      delete values['password']
      const data = await fnUpateData('employees',"employees", values,'id = ? AND isactive = ?',[employee['id'],1], 'update');
      console.log(data) 
      
    } catch (error) {
      console.log(error)
    }

    // var actionStr = sessionStorage.getItem('actionStr')
    // try {
    //   createUserWithEmailAndPassword(auth, values['email'], values['password'])
    //   .then((userCredential) => {
    //     // Signed up 
    //     const user = userCredential.user;
    //     console.log(user.uid)
    //     updateProfile(user, {
    //       displayName: `${values['firstname']} ${values['lastname']}`
    //     }).then(async() => {
    //         var companyid = sessionStorage.getItem('companyid')
    //         delete values.password
    
    //         values['companyid'] = companyid
    //         values['skills'] = skills
    //         values['isactive'] = 1
    //         values['createddate'] = new Date().toISOString().slice(0, 16)
    //         // values['lastpaid'] = new Date().toISOString().slice(0, 16) 
    //         const data = await fnCreateData('employees',"employees", values, 'new');
    //         if(data.insertId != null || data.insertId != undefined){
    //           fnGoBack()
    //         }else{
    //           console.log('Something went wrong')
    //         }
    //         // const docId = await fnAddDocument("users", values);
    //         //  if (docId == null){
    //         //   alert('Something went wrong. Please try again')
    //         //  }else{
              
    //         //  }
    //         //  fnGoBack()
    //     }).catch((error) => {
    //       console.error("Error updating display name:", error);
    //     });
    //     // ...
    //   })
    //   .catch((error) => {
    //     // setLoading(false)
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log(errorCode)
    //     alert(errorMessage)
    //   });
    // } catch (error) {
    //   // setLoading(false)
    //   console.log(error)
    // }
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
        {/* <Tooltip title="Delete"> */}
            <Button type="primary" icon={<DeleteOutlined/>} style={{backgroundColor: '#a7a7a7ff', marginLeft: 8}}/>
        {/* </Tooltip> */}
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

  const handleLogoUpload = async (e) => {
      const file = e.target.files;
  
      let url = await fnFileURls(file)

      let values = {
        photourl: url[0].url
      }
      try {
        const data = await fnUpateData('employees',"employees", values,'id = ?',[employee['id']], 'update');
        setPhotoUrl(url[0].url)
        sessionStorage.setItem('photourl',url[0].url)
      } catch (error) {
          console.log(error)
      }
  };


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
      alert('Password update')
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <>
        {
                employee == null ? (
                  <Skeleton active />
                ):(
                    <Content style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>

                        <Row style={{padding: 15, height: '100%', overflowY: 'scroll',scrollbarWidth: 'none'}}>
                        <Col span={24} style={{}}>
                        <Card style={{width: '100%', height: '100%'}}>
                            <div className="mb-5 pb-5 border-bottom">
                                <label className="form-label fw-semibold">Profile picture</label>
                                <div className="d-flex align-items-center gap-4">
                                <div 
                                    className="border rounded d-flex align-items-center justify-content-center bg-light"
                                    style={{ width: '100px', height: '100px', overflow: 'hidden' }}
                                >
                                    {employee?.photourl ? (
                                    <img 
                                        src={photourl} 
                                        alt="profile" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    ) : (
                                    <Building2 size={48} className="text-secondary" />
                                    )}
                                </div>
                                <div>
                                    <label className="btn btn-primary d-inline-flex align-items-center gap-2">
                                    <Upload size={16} />
                                    Upload Logo
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleLogoUpload} 
                                        className="d-none" 
                                    />
                                    </label>
                                    <p className="text-muted small mt-2 mb-0">PNG, JPG up to 5MB</p>
                                </div>
                                </div>
                            </div>
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
                                            <Input placeholder="" disabled={true} />
                                        </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="form-group">
                                        <label>Last name</label>
                                        <Form.Item name="lastname" rules={[{ required: true,message: 'Please input last name!' }]}>
                                            <Input placeholder="" disabled={true}/>
                                        </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="form-group">
                                        <label>Email</label>
                                        <Form.Item name="email" rules={[{ required: true, type: 'email',message: 'Please input email!'  }]}>
                                            <Input placeholder="e.g., johndoe@company.com" disabled={true}/>
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
                                            <Button onClick={() => fnUpdatePassword()}>
                                              Update Password
                                            </Button>
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
                                            <input type="datetime-local" disabled={true}/>
                                        </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="form-group">
                                        <label>Department</label>
                                        <Form.Item name="department" rules={[{ required: true,message: 'Please input Department!'  }]}>
                                            <Select size='large' showSearch allowClear={true} filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}  placeholder="Select department" disabled={true} >
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
                                            <Input placeholder="e.g CRM Manager" disabled={true}/>
                                        </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="form-group">
                                        <label>Start Date</label>
                                        <Form.Item name="startdate">
                                            <input type="datetime-local" disabled={true}/>
                                        </Form.Item>
                                        </div>
                                    </Col>

                                    <Col span={12}>
                                        <div className="form-group">
                                        <label>Employment Type</label>
                                        <Form.Item name="employmenttype">
                                            <Select placeholder="Choose type" size='large' disabled={true}>
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
                                            <Select size='large' disabled={true}>
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
                                            <Input placeholder="e.g 8am - 16pm" disabled={true}/>
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
                                            <Select size='large' showSearch allowClear={true} filterOption={(input, option) =>(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}  placeholder="Select department" disabled={true}>
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

                                        {/* <Col span={24}>
                                        <Typography style={{...Styles.text, fontSize: 18}}>Skills</Typography>
                                        </Col> */}

                                        {/* <Col span={16}>
                                        <div className="form-group">
                                            <Input placeholder="" defaultValue={skill} onChange={ e => setSkill(e.target.value)} />
                                        </div>
                                        </Col>

                                        <Col span={8} style={{ textAlign: 'left' }}>
                                        <Button onClick={fnAddSkill}>
                                            Add skill
                                        </Button>
                                        </Col> */}

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
                                        Update Details
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
                )
        }
    </>
    
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

export default Profile