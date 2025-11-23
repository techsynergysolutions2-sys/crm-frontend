import React,{ useRef, useState, useEffect } from 'react'
import {Col, Row,Button, Input, Space, Table,FloatButton,Tooltip,Switch   } from 'antd';
import { SearchOutlined,EditOutlined,PlusOutlined,FormOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import {fnGetDirectData } from '../../shared/shared';
import {useNavigate } from 'react-router-dom'


function PermissionsList() {
    
    const navigate = useNavigate()
    const [permissions, setPermissions] = useState([])
    const [filteredPermissions, setFilteredPermissions] = useState([])

    useEffect(() => {

        fetchGroups();

    },[])

    const fetchGroups = async () => {
        var companyid = sessionStorage.getItem('companyid')
        let sql = `
                  SELECT gp.*,ug.title 
                  FROM group_permissions gp
                  JOIN user_groups ug
                  ON gp.id = ug.id
                  WHERE gp.companyid = ${companyid}
                  `
              
        try {
          const data = await fnGetDirectData('orders',sql);
          setPermissions(data);
          setFilteredPermissions(data)
        } catch (error) {
          
        }
        
    };

  const fnAddEditDepartment = (record) => {
    navigate("/permissions",{
      state: record
    })
  }

  const fnHandleSearch = (e) => {
    setFilteredPermissions(permissions.filter(p => p.title.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <Row style={{padding: 15, height: '100vh', backgroundColor: '#fff',overflowY: 'scroll',scrollbarWidth: 'none'}}>

      <div className="container">
        <h1 className="dashboard-title">Permissions</h1>
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search by group name" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
            </div>
          </div>
        </div>
      
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Group name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermissions.length > 0 ? (
                filteredPermissions.map((per) => (
                  <tr key={per.id}>
                    <td>{per.title}</td>
                    <td>{
                      per.isactive == 1 ? (
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
                          onClick={() => fnAddEditDepartment(per) }
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
                    No group found matching your criteria
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

export default PermissionsList