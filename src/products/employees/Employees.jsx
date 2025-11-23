import { useState, useEffect } from 'react'
import {Row,Input, FloatButton,Tooltip } from 'antd';
import { PlusOutlined,FormOutlined } from '@ant-design/icons';
import { fnGetDirectData,fnGetData } from '../../shared/shared';
import {useNavigate } from 'react-router-dom'


function Employees() {
    
  const navigate = useNavigate()

  const fnAddEditEmployee = (record) => {
    navigate("/employee",{
      state: record
    })
  }

  const [employees, setEmployees] = useState([])
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchUsers = async () => {
      var companyid = sessionStorage.getItem('companyid')
      let sql = `
                  SELECT e.id,e.firstname,e.lastname,e.email,e.phone,e.dob,e.department,e.role,e.startdate,e.employmenttype,e.status,
                  e.workinghours,e.address,e.city,e.country,e.contactname,e.contactphone,e.createdby,e.createddate,e.companyid,
                  e.photourl,e.isactive,e.groupid,d.title FROM employees e 
                  LEFT JOIN departments d
                  ON e.department = d.id
                  WHERE e.companyid = ${companyid} AND e.isactive = 1
                  `
      try {
        const data = await fnGetDirectData('employees',sql);
        const data2 = await fnGetData('company',"companies", {id: companyid}, { columns: '*'});
        setEmployees(data);
        setFilteredEmployees(data)
        setLoading(!loading)
        let temp = data2[0].employee_count - data.length
        setCount(temp)
      } catch (error) {
        console.log(error)
      }
      
    };

    fetchUsers();

  },[])

  const handleClose = () => {
    setLoading(!loading)
  };

  const fnHandleSearch = (e) => {
    setFilteredEmployees(employees.filter(p => p.firstname.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <Row style={{padding: 15, height: '100vh', backgroundColor: '#fff',overflowY: 'scroll',scrollbarWidth: 'none'}}>
        <div className="container">
        <h1 className="dashboard-title">Employees</h1>
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search by firstname" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
            </div>
          </div>
        </div>
      
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.firstname}</td>
                    <td>{emp.lastname}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.title}</td>
                    <td>{
                      emp.status != 4 ? (
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
                          onClick={() => fnAddEditEmployee(emp)}
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
                    No employees found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>

      {
        count >= 1 ? (
          <FloatButton
              onClick={() => fnAddEditEmployee({})}
              shape="circle"
              type="primary"
              style={{ insetInlineEnd: 24 }}
              icon={<Tooltip placement="top" title={'New employee'}><PlusOutlined /></Tooltip>}
            />
        ):(null)
      }

    </Row>
  )
}

export default Employees