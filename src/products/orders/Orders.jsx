import { useState, useEffect } from 'react';
import { EyeOutlined,FormOutlined,PlusOutlined } from '@ant-design/icons';
import { Input,FloatButton,Tooltip,Select } from 'antd';
import {useNavigate } from 'react-router-dom'
import {order_status,fnGetDirectData } from '../../shared/shared'
import './orders.css';

const { Option } = Select;

const Orders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalPending, setTotalPending] = useState(0)
  const [totalCanceled, setTotalCanceled] = useState(0)
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  const fnNavNewOrder = (record) => {
    navigate("/neworder",{
      state: record
    })
  }

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
      var companyid = sessionStorage.getItem('companyid')
      // var uid = sessionStorage.getItem('uid')
      let sql = `
            SELECT 
            o.id, 
            o.ordernumber,
            o.customername, 
            o.contactnumber,
            o.orderdate,
            o.status,
            o.email,
            o.deliveryaddress,
            o.assignto,
            -- Calculate total per order
            COALESCE(SUM(op.price * op.quantity), 0) AS order_total,

            -- Aggregate products as JSON array
            COALESCE(
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'product_id', p.id,
                  'quantity', op.quantity,
                  'price', op.price,
                  'subtotal', op.price * op.quantity,
                  'title', p.title
                )
              ),
              JSON_ARRAY()
            ) AS products,

            -- Global order stats (joined once)
            totals.total_orders,
            totals.completed_orders,
            totals.pending_orders,
            totals.processing_orders,
            totals.canceled_orders

            FROM orders o
            LEFT JOIN order_products op ON o.id = op.orderid
            LEFT JOIN products p ON op.productid = p.id
            CROSS JOIN (
            SELECT 
              COUNT(CASE WHEN (companyid = ${companyid}) THEN 1 END) AS total_orders,
              COUNT(CASE WHEN (status = 1 AND companyid = ${companyid}) THEN 1 END) AS pending_orders,
              COUNT(CASE WHEN (status = 2 AND companyid = ${companyid}) THEN 1 END) AS processing_orders,
              COUNT(CASE WHEN (status = 3 AND companyid = ${companyid}) THEN 1 END) AS completed_orders,
              COUNT(CASE WHEN (status = 4 AND companyid = ${companyid}) THEN 1 END) AS canceled_orders
            FROM orders
            ) totals

            WHERE o.companyid = ${companyid} 
            AND o.isactive = 1
            GROUP BY o.id
            ORDER BY o.orderdate DESC;

          `
      
      try {
      const data = await fnGetDirectData('orders',sql);
      if(data?.length > 0){
        setTotalOrders(data[0].total_orders)
        setTotalCompleted(data[0].completed_orders)
        setTotalPending(data[0].pending_orders)
        setTotalCanceled(data[0].canceled_orders)
        setOrders(data);
        setFilteredOrders(data);
      }
      // setLoading(!loading)
      } catch (error) {
      // console.log(error)
      }
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAction = (action, order) => {
    switch (action) {
      case 'view':
        navigate("/invoice",{
          state: order
        })
        break;
      case 'edit':
        alert(`Editing order ${order}`);
        break;
      case 'download':
        alert(`Downloading invoice for ${order}`);
        break;
      default:
        break;
    }
  };

  const fnFilterByStatus = (s) => {
   
    if(s !== 0){
      setFilteredOrders(orders.filter(order => order.status === s))
    }else if(s == 0){
      setFilteredOrders(orders)
    }
  
  }

  const fnHandleSearch = (e) => {
    setFilteredOrders(orders.filter(p => p.customername.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none',backgroundColor: '#fff'}}>
      <div className="container">
        <h1 className="dashboard-title">Order Management</h1>
        <StatsCards totalOrders={totalOrders} totalCompleted={totalCompleted} totalPending={totalPending} totalCanceled={totalCanceled} />
        
        <div className="filters-section">
          <div className="filters-row">
            <div className="search-box">
              <Input.Search placeholder="search" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
            </div>
            <div className="filter-group">
              <Select style={{ width: 200 }} placeholder="Please select a client" onChange={e => fnFilterByStatus(e)}size='large'> 
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
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.ordernumber}</td>
                    <td>{order.customername}</td>
                    <td>{order.orderdate?.replace('T', ' ')}</td>
                    <td>{Intl.NumberFormat(undefined,{style: 'currency', currency: 'USD'}).format(order.order_total)}</td>
                    <td><GetStatusBadge status={order.status} /> </td>
                    <td>
                      <Tooltip placement="top" title={'View'}>
                        <button 
                          className="action-btn"
                          onClick={() => handleAction('view', order)}
                        >
                          <EyeOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip placement="top" title={'Edit'}>
                        <button 
                          className="action-btn"
                          onClick={() => fnNavNewOrder(order)}
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
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalOrders={filteredOrders.length}
          ordersPerPage={ordersPerPage}
          onPageChange={handlePageChange}
        />
      </div>
      <FloatButton onClick={() => fnNavNewOrder({})} shape="circle" type="primary" style={{ insetInlineEnd: 24 }} icon={<Tooltip placement="top" title={'New project'}><PlusOutlined /></Tooltip>} />
    </div>
  );
};

// Stats Cards Component
const StatsCards = ({totalOrders, totalCompleted, totalPending, totalCanceled }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card primary">
        <div className="stat-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <div className="stat-value">{totalOrders}</div>
        <div className="stat-label">Total Orders</div>
      </div>
      <div className="stat-card success">
        <div className="stat-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="stat-value">{totalCompleted}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card warning">
        <div className="stat-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="stat-value">{totalPending}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card danger">
        <div className="stat-icon">
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="stat-value">{totalCanceled}</div>
        <div className="stat-label">Cancelled</div>
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

export default Orders;