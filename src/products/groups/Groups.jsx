import { useState, useEffect} from 'react'
import {Row,Input,FloatButton,Tooltip  } from 'antd';
import { PlusOutlined,FormOutlined } from '@ant-design/icons';
import {fnGetData } from '../../shared/shared';
import {useNavigate } from 'react-router-dom'


function Groups() {
    
  const navigate = useNavigate()

  const [groups, setGroups] = useState([])
  const [filteredGroups, setFilteredGroups] = useState([])

  useEffect(() => {

    fetchGroups();

  },[])

  const fetchGroups = async () => {
      var companyid = sessionStorage.getItem('companyid')
      const data = await fnGetData('groups',"user_groups", {companyid: companyid}, { columns: '*'});
      setGroups(data);
      setFilteredGroups(data)
    };

  const fnAddEditGroup = (record) => {
    navigate("/group",{
      state: record
    })
  }

  const fnHandleSearch = (e) => {
    setFilteredGroups(groups.filter(g => g.title.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <Row style={{padding: 15, height: '100vh', backgroundColor: '#fff',overflowY: 'scroll',scrollbarWidth: 'none'}}>

      <div className="container">
        <h1 className="dashboard-title">Groups</h1>
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search by group title" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
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
              {filteredGroups.length > 0 ? (
                filteredGroups.map((gr) => (
                  <tr key={gr.id}>
                    <td>{gr.title}</td>
                    <td>{
                      gr.isactive == 1 ? (
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
                          onClick={() => fnAddEditGroup(gr) }
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
                    No groups found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
            <FloatButton
              onClick={() => fnAddEditGroup({})}
              shape="circle"
              type="primary"
              style={{ insetInlineEnd: 24 }}
              icon={<Tooltip placement="top" title={'New user group'}><PlusOutlined /></Tooltip>}
            />

    </Row>
  )
}

export default Groups