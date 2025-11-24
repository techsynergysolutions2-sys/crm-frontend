import React, { useState, useEffect,useMemo } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, Users, Upload, Save } from 'lucide-react';
import {InputNumber, Skeleton,Col, Row,Button ,Input ,Form,Modal,notification } from 'antd';
import 'bootstrap/dist/css/bootstrap.css';
import {fnGetData,fnUpateData,fnGetDirectData,url,amou,fnFileURls,fnCheckExpiryDate} from '../../shared/shared'
import {useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

const { TextArea } = Input;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

export default function CompanyProfile() {
  const [company, setCompany] = useState(null)
  const [employees, setEmployees] = useState([])
  const [space, setSpace] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenExpired, SetIsModalOpenExpired] = useState(fnCheckExpiryDate);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [numSpace, setNumSpace] = useState(0)
  const [count, setCount] = useState(0)
  const [logo, setLogo] = useState('')
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate()
  const [isExpired, setIsExpired] = useState(fnCheckExpiryDate)

  useEffect(() => {
    // console.log(isModalOpenExpired)
    fetchData()
  },[])

  const fetchData = async () => {
    var companyid = sessionStorage.getItem('companyid')
    try {
      let sql = `
                  SELECT e.*,d.title FROM employees e 
                  LEFT JOIN departments d
                  ON e.department = d.id
                  WHERE e.companyid = ${companyid}`
      try {
        const data = await fnGetData('company',"companies", {id: companyid,isactive: 1}, { columns: '*'})
        const data2 = await fnGetDirectData('employees',sql);

        setCompany(data[0]);
        setLogo(data[0]?.logourl)
        setEmployees(data2)
        setCount(data[0].employee_count)
        let temp = data[0].employee_count - data2.length
        setSpace(temp)
      } catch (error) {
        
      }
      
    } catch (error) {
      console.log(error)
    }
    
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // const fnAddEditEmployee = (record) => {
  //   sessionStorage.setItem('space',space)
  //   navigate("/employee",{
  //     state: record
  //   })
  // }

  const handleLogoUpload = async (e) => {
    const file = e.target.files;

    let url = await fnFileURls(file)

    console.log(file)
    console.log(url[0])
    let values = {
      logourl: url[0].url
    }
    try {
      const data = await fnUpateData('company',"companies", values,'id = ?',[company['id']], 'update');
      if(data?.affectedRows > 0){
        api.success({
            title: ``,
            description: 'Logo updated successfully.',
            placement,duration: 2,
            style: {
                background: "#e2e2e2ff"
            },
        });
        setLogo(url[0].url)
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
  };

  const onFinish = (values) => {

      const fnSendData = async () => {
        try {
          const data = await fnUpateData('company',"companies", values,'id = ?',[company['id']], 'update');
          if(data?.affectedRows > 0){
            api.success({
                title: ``,
                description: 'Information updated successfully.',
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

      fnSendData()
  };

   const createOrder = async () => {

    if(numSpace < 0){
      api.warning({
          title: ``,
          description: 'Please enter number of spaces',
          placement,duration: 2,
          style: {
          background: "#e2e2e2ff"
          },
      });
      return
    }

    const expdate = new Date(company['expirydate']);
    const currdate = new Date(); // current date

    const yearsDiff = currdate.getFullYear() - expdate.getFullYear();
    const monthsDiff = currdate.getMonth() - expdate.getMonth();

    let totalMonths = (yearsDiff * 12 + monthsDiff);

    totalMonths = -1 * totalMonths

    try {
      if(isModalOpenExpired){
        const res = await axios.post(`${url}/space`, {
        amount: (amou * employees.length),
        action: 'orders'
      });
      return res.data.id;
      }else{
        const res = await axios.post(`${url}/space`, {
        amount: (amou * numSpace) * totalMonths,
        action: 'orders'
      });
      return res.data.id;
      }
      
    } catch (err) {
      api.warning({
          title: ``,
          description: 'Could not create PayPal order',
          placement,duration: 2,
          style: {
          background: "#e2e2e2ff"
          },
      });
    }
    
  };

  const onApprove = async (data) => {

    if(numSpace < 0){
      api.warning({
          title: ``,
          description: 'Please enter number of spaces',
          placement,duration: 2,
          style: {
          background: "#e2e2e2ff"
          },
      });
      return
    }

    var companyid = sessionStorage.getItem('companyid')
    try {
      let temp = count + numSpace
      const res = await axios.post(
        `${url}/space`,{action: 'capture',orderID: data.orderID, compid: companyid, totalspace: temp}
      );
      if (res.data.status === "COMPLETED") {
        setSuccess(true);
        fetchData()
        handleCancel()
        api.success({
              title: ``,
              description: 'Payment successfully.',
              placement,duration: 2,
              style: {
                  background: "#e2e2e2ff"
              },
          });
          
          if(isExpired){
            const currdate = new Date().toISOString().slice(0, 16)
            const date = new Date(currdate);

            date.setUTCFullYear(date.getUTCFullYear() + 1);
            let obj = {
              expirydate: date
            }
            const data = await fnUpateData('company',"companies", obj,'id = ?',[company['id']], 'update');
            if(data?.affectedRows > 0){
              setIsExpired(false)
              SetIsModalOpenExpired(false)
            }
          }
          

      }else{
        api.warning({
            title: ``,
            description: 'Payment failed. Try again or contact support.',
            placement,duration: 2,
            style: {
            background: "#e2e2e2ff"
            },
        });
      }
    } catch (err) {
      api.warning({
          title: ``,
          description: 'Payment failed. Try again or contact support.',
          placement,duration: 2,
          style: {
          background: "#e2e2e2ff"
          },
      });
    }
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <>
    <Context.Provider value={contextValue}>
    {contextHolder}
      {
        company == null ? (
          <Skeleton active />
        ):(
          <div style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
            <link 
              href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
              rel="stylesheet"
            />


            <Modal
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
            >
              <div className="" style={{marginBottom: 15}}>
                <label className="form-label">Number of spaces</label>
                <InputNumber style={{width: '100%'}} onChange={ e => setNumSpace(e)}/>
              </div>
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
            </Modal>

            <Modal
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={isModalOpenExpired}
              footer={null}
            >
              <div className="" style={{marginBottom: 15}}>
                <label className="form-label">Subscription Expired</label>
                <label className="form-label">Number of spaces {employees.length}</label>
                {/* <InputNumber style={{width: '100%'}} onChange={ e => setNumSpace(e)}/> */}
              </div>
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
            </Modal>



            
            <div className="min-vh-100 bg-light py-1">
              <div className="container">
                <div className="card shadow-lg border-0">
                  {/* Header */}
                  <div className="card-header bg-primary text-white py-4">
                    <h1 className="h2 mb-2 d-flex align-items-center">
                      <Building2 className="me-3" size={32} />
                      Company Profile Settings
                    </h1>
                    <p className="mb-0 opacity-75">Manage your company information and preferences</p>
                  </div>

                  <div className="card-body p-4 p-md-5">
                    {/* Logo Upload */}
                    <div className="mb-5 pb-5 border-bottom">
                      <label className="form-label fw-semibold">Company Logo</label>
                      <div className="d-flex align-items-center gap-4">
                        <div 
                          className="border rounded d-flex align-items-center justify-content-center bg-light"
                          style={{ width: '100px', height: '100px', overflow: 'hidden' }}
                        >
                          {company?.logourl ? (
                            <img 
                              src={logo} 
                              alt="Company Logo" 
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
                    
                    <Form
                      initialValues={company}
                      // layout="vertical"
                      onFinish={onFinish}
                      style={{ maxWidth: 800, margin: '0 auto' }}
                    >
                      {/* Basic Information */}
                      <div className="mb-5">
                        <h2 className="h4 mb-4">Basic Information</h2>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">Company Name *</label>
                            <Form.Item name="companyname" rules={[{ required: true,message: 'Please input a company name!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Industry *</label>
                            <Form.Item name="industry" rules={[{ required: true,message: 'Please input industry!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="mb-5">
                        <h2 className="h4 mb-4">Contact Information</h2>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label d-flex align-items-center gap-2">
                              <Mail size={16} />
                              Email *
                            </label>
                            <Form.Item name="email" rules={[{ required: true,message: 'Please input email!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label d-flex align-items-center gap-2">
                              <Phone size={16} />
                              Phone
                            </label>
                            <Form.Item name="phone" rules={[{ required: true,message: 'Please input Phone!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-12">
                            <label className="form-label d-flex align-items-center gap-2">
                              <Globe size={16} />
                              Website
                            </label>
                            <Form.Item name="website" rules={[{ required: true,message: 'Please input Website!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="mb-5">
                        <h2 className="h4 mb-4 d-flex align-items-center gap-2">
                          <MapPin size={20} />
                          Address
                        </h2>
                        <div className="row g-3">
                          <div className="col-12">
                            <label className="form-label">Street Address</label>
                            <Form.Item name="street_address" rules={[{ required: true,message: 'Please input street address!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">City</label>
                            <Form.Item name="city" rules={[{ required: true,message: 'Please input city!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">State/Province</label>
                            <Form.Item name="province" rules={[{ required: true,message: 'Please input province!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">ZIP/Postal Code</label>
                            <Form.Item name="postal_code" rules={[{ required: true,message: 'Please input postal code!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Country</label>
                            <Form.Item name="country" rules={[{ required: true,message: 'Please input country!' }]}>
                              <Input placeholder="" size='large' />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="mb-5">
                        <h2 className="h4 mb-4">Additional Details</h2>
                        <div className="row g-3">
                          <div className="col-12">
                            <Row>
                              <Col span={7}>
                                <label className="form-label d-flex align-items-center gap-2">
                                <Users size={16} />
                                Employee count
                              </label>
                              <Form.Item name="employee_count">
                                <InputNumber placeholder="" size='large' disabled/>
                              </Form.Item>
                              </Col>
                              <Col span={7}>
                                <label className="form-label d-flex align-items-center gap-2">
                                  <Users size={16} />
                                  Active employees
                                </label>
                                {/* <Form.Item name="employee_count"> */}
                                  <InputNumber placeholder="" size='large' disabled defaultValue={employees.length}/>
                                {/* </Form.Item> */}
                              </Col>
                              <Col span={7}>
                                <label className="form-label d-flex align-items-center gap-2">
                                  <Users size={16} />
                                  Available space
                                </label>
                                {/* <Form.Item name="employee_count" rules={[{ required: true,message: 'Please input employee count!' }]}> */}
                                  <InputNumber placeholder="" size='large' disabled defaultValue={space}/>
                                {/* </Form.Item> */}
                              </Col>
                              <Col span={3}>
                                <Button type="primary" onClick={() => showModal()} style={{backgroundColor: '#1092a7', color: '#fff', marginTop: 34}}>
                                  Add space
                                </Button>
                              </Col>
                            </Row>
                          </div>
                          <div className="col-12">
                            <label className="form-label">Company Description</label>
                            <Form.Item name="description" >
                              <TextArea rows={3}  />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-flex align-items-center justify-content-end gap-3 pt-4 border-top">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg d-flex align-items-center gap-2"
                        >
                          <Save size={20} />
                          Save Changes
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      </Context.Provider>
    </>
  );
}