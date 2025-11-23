import React,{ useRef, useState, useEffect } from 'react'
import {Col, Row,Button, Input, Space, Table,FloatButton,Tooltip,Switch   } from 'antd';
import { SearchOutlined,EditOutlined,PlusOutlined,FormOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {fnGetData } from '../../shared/shared';
import {useNavigate } from 'react-router-dom'


function Departments() {
    
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])
  const [filteredDepartments, setFilteredDepartments] = useState([])

  useEffect(() => {

    fetchGroups();

  },[])

  const fetchGroups = async () => {
      var companyid = sessionStorage.getItem('companyid')
      const data = await fnGetData('departments',"departments", {companyid: companyid}, { columns: '*'});
      setDepartments(data);
      setFilteredDepartments(data)
    };

  const fnAddEditDepartment = (record) => {
    navigate("/department",{
      state: record
    })
  }

  const fnHandleSearch = (e) => {
    setFilteredDepartments(departments.filter(d => d.title.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <Row style={{padding: 15, height: '100vh', backgroundColor: '#fff',overflowY: 'scroll',scrollbarWidth: 'none'}}>

      <div className="container">
        <h1 className="dashboard-title">Departments</h1>
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search by departments title" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
            </div>
          </div>
        </div>
      
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((depart) => (
                  <tr key={depart.id}>
                    <td>{depart.title}</td>
                    <td>{
                      depart.isactive == 1 ? (
                        <span className={`status-badge status-completed`}>
                          Active
                        </span>
                      ):(
                        <span className={`status-badge status-cancelled`}>
                          Disabled
                        </span>
                      )
                    }</td>
                    <td>
                      <Tooltip placement="top" title={'Edit'}>
                        <button 
                          className="action-btn"
                          onClick={() => fnAddEditDepartment(depart) }
                        >
                          <FormOutlined />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                    No departments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
            <FloatButton
              onClick={() => fnAddEditDepartment({})}
              shape="circle"
              type="primary"
              style={{ insetInlineEnd: 24 }}
              icon={<Tooltip placement="top" title={'New user group'}><PlusOutlined /></Tooltip>}
            />

    </Row>
  )
}

export default Departments