import { useState, useEffect } from 'react';
import { FormOutlined,PlusOutlined } from '@ant-design/icons';
import { Input,FloatButton,Tooltip,Select } from 'antd';
import {useNavigate } from 'react-router-dom'
import {order_status,fnGetDirectData } from '../../shared/shared'

const { Option } = Select;

const Tickets = () => {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([]);
  const [totalOpened, setTotalOpened] = useState(0)
  const [totalUnassigned, setTotalUnassigned] = useState(0)
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const fnNavNewTicket = (record) => {
    navigate("/ticket",{
      state: record
    })
  }

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
      var companyid = sessionStorage.getItem('companyid')
      var uid = sessionStorage.getItem('uid')
      let sql = `
            SELECT t.*,CONCAT(e.firstname, ' ', e.lastname) AS fullname,
            CONCAT(ea.firstname, ' ', ea.lastname) AS assigned_fullname
            FROM tickets t
            JOIN employees e
            ON t.createdby = e.id
            JOIN employees ea
            ON t.assignto = ea.id
            WHERE t.isactive = 1 AND t.companyid = ${companyid}
            AND (t.assignto = ${uid} OR t.assignto = NULL)
          `
      
      try {
      const data = await fnGetDirectData('orders',sql);
      if(data?.length > 0){
        let temp_opened = data.filter(t => t.assignedto == uid )
        let temp_unassigned = data.filter(t => t.assignedto == null)
        setTotalOpened(temp_opened.length)
        setTotalUnassigned(temp_unassigned.length)
        setTickets(data);
        setFilteredTickets(data);
      }
      } catch (error) {
      // console.log(error)
      }
  };

  const totalPages = Math.ceil(filteredTickets.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fnFilterByStatus = (s) => {
   
    if(s !== 0){
      setFilteredTickets(tickets.filter(t => t.status === s))
    }else if(s == 0){
      setFilteredTickets(tickets)
    }
  
  }

  const fnHandleSearch = (e) => {
    setFilteredTickets(tickets.filter(t => t.customername.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none',backgroundColor: '#fff'}}>
      <div className="container">
        <h1 className="dashboard-title">Tickets</h1>
        <StatsCards totalOpened={totalOpened} totalUnassigned={totalUnassigned} />
        
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
              <Select style={{ width: 200 }} defaultValue={0} placeholder="Please select a client" onChange={e => fnFilterByStatus(e)}size='large'> 
                <Option value={0}>All</Option>
                { 
                  order_status?.map((itm,key) => (
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
                <th>Created by</th>
                <th>Date</th>
                <th>Assigned to</th>
                {/* <th>Category</th> */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>{t.fullname}</td>
                    <td>{t.createddate?.replace('T', ' ')}</td>
                    <td>{t.assigned_fullname}</td>
                    <td><GetStatusBadge status={t.status} /> </td>
                    <td>
                      <Tooltip placement="top" title={'Edit'}>
                        <button 
                          className="action-btn"
                          onClick={() => fnNavNewTicket(t)}
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
                    No tickets found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={filteredTickets.length}
          ordersPerPage={ordersPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <FloatButton onClick={() => fnNavNewTicket({})} shape="circle" type="primary" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="top" title={'New project'}><PlusOutlined /></Tooltip>} />
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({totalOpened, totalUnassigned, totalPending, totalCanceled }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card primary">
        <div className="stat-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <div className="stat-value">{totalOpened}</div>
        <div className="stat-label">Your tickets</div>
      </div>
      <div className="stat-card success">
        <div className="stat-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-value">{totalUnassigned}</div>
        <div className="stat-label">Unassigned tickets</div>
      </div>
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
        setStatusClasses('status-processing')
        setStatusName('Processing')
      }else if(status == 3){
        setStatusClasses('status-completed')
        setStatusName('Completed')
      }else if(status == 4){
        setStatusClasses('status-cancelled')
        setStatusName('Cancelled')
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

export default Tickets;