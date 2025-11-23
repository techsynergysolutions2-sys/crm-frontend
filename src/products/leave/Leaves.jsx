import { useState, useEffect } from 'react';
import { FormOutlined,PlusOutlined } from '@ant-design/icons';
import { Input,FloatButton,Tooltip,Select } from 'antd';
import {useNavigate } from 'react-router-dom'
import {leave_status,leave_type,fnGetDirectData } from '../../shared/shared'

const { Option } = Select;

const Leaves = () => {
  const navigate = useNavigate()
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const fnNavNewLeave = (record) => {
    navigate("/leaveform",{
      state: record
    })
  }

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
      var companyid = sessionStorage.getItem('companyid')
      var uid = sessionStorage.getItem('uid')
      var groupid = sessionStorage.getItem('groupid')

      let sql = ''
      if(groupid == '1' || groupid == 1){
        sql = `
            SELECT l.*,CONCAT(e.firstname, ' ', e.lastname) AS fullname
            FROM leaves l 
            JOIN employees e
            ON l.employee = e.id
            WHERE l.companyid = ${companyid} AND l.isactive = 1;
          `
      }else{
        sql = `
            SELECT l.*,CONCAT(e.firstname, ' ', e.lastname) AS fullname
            FROM leaves l 
            JOIN employees e
            ON l.employee = e.id
            WHERE l.companyid = ${companyid} AND l.isactive = 1 AND l.employee = ${uid};
          `
      }
      
      
      try {
      const data = await fnGetDirectData('leaves',sql);
      if(data?.length > 0){
        setLeaves(data);
        setFilteredLeaves(data);
      }
      } catch (error) {
      // console.log(error)
      }
  };


  // Pagination
  const totalPages = Math.ceil(filteredLeaves.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fnFilterByStatus = (s) => {
   
    if(s !== 0){
      setFilteredLeaves(leaves.filter(lv => lv.status === s))
    }else if(s == 0){
      setFilteredLeaves(leaves)
    }
  
  }

  const fnHandleSearch = (e) => {
    setFilteredLeaves(leaves.filter(lv => lv.fullname.toLowerCase().includes(e.toLowerCase())))
  }

  const fnLeaveTypeLabel = (id) => {
    let temp = leave_type.filter(lv => lv.id == id)
    return temp[0]?.label
  }

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none',backgroundColor: '#fff'}}>
      <div className="container">
        <h1 className="dashboard-title">Leave</h1>
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
              <Select style={{ width: 200 }} defaultValue={0} placeholder="Please select a client" onChange={e => fnFilterByStatus(e)}size='large'> 
                <Option value={0}>All</Option>
                { 
                  leave_status?.map((itm,key) => (
                    <Option key={itm.id} value={itm.id}>{itm.label}</Option>
                  ))
                }
              </Select>
            </div>
          </div>
        </div>
      
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Name & Surname</th>
                <th>Leave type</th>
                <th>Start date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length > 0 ? (
                filteredLeaves.map((lv) => (
                  <tr key={lv.id}>
                    <td>{lv.fullname}</td>
                    <td>{fnLeaveTypeLabel(lv.leavetype)}</td>
                    <td>{lv.startdate?.replace('T', ' ')}</td>
                    <td>{lv.enddate?.replace('T', ' ')}</td>
                    <td><GetStatusBadge status={lv.status} /> </td>
                    <td>
                      <Tooltip placement="top" title={'Edit'}>
                        <button 
                          className="action-btn"
                          onClick={() => fnNavNewLeave(lv)}
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
                    No leaves found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={filteredLeaves.length}
          ordersPerPage={ordersPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <FloatButton onClick={() => fnNavNewLeave({})} shape="circle" type="primary" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="top" title={'New project'}><PlusOutlined /></Tooltip>} />
    </div>
  );
};


const GetStatusBadge = ({status}) => {
    const [statusClasses, setStatusClasses] = useState('')
    const [statusName, setStatusName] = useState('')
    useEffect(() => {
      if(status == 1){
        setStatusClasses('status-pending')
        setStatusName('Pending')
      }else if(status == 2){
        setStatusClasses('status-completed')
        setStatusName('Approved')
      }else if(status == 3){
        setStatusClasses('status-cancelled')
        setStatusName('Rejected')
      }
    },[])

    return (
      <span className={`status-badge ${statusClasses}`}>
        {statusName}
      </span>
    );
  };


// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalOrders, 
  ordersPerPage, 
  onPageChange 
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  const startOrder = (currentPage - 1) * ordersPerPage + 1;
  const endOrder = Math.min(currentPage * ordersPerPage, totalOrders);

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {startOrder} to {endOrder} of {totalOrders} orders
      </div>
      <div className="pagination-controls">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        
        {renderPageNumbers()}
        
        {totalPages > 4 && currentPage < totalPages - 2 && (
          <span style={{ padding: '8px 15px' }}>...</span>
        )}
        
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Leaves;