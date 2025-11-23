import React, { useState, useEffect } from 'react';
import { EyeOutlined,FormOutlined,CloudDownloadOutlined,DotChartOutlined,ArrowDownOutlined,DollarOutlined,ShoppingCartOutlined,ArrowUpOutlined, BookOutlined } from '@ant-design/icons';
import { Input,FloatButton,Tooltip,Select,Statistic, Col, Row,Card  } from 'antd';
import {useNavigate } from 'react-router-dom'
import {order_status,fnGetData,fnGetDirectData,fnCreateData,fnUpateData } from '../../shared/shared'
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';


const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [revenue, setRevenue] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [totalPending, setTotalPending] = useState(0)
    const [totalCanceled, setTotalCanceled] = useState(0)
    const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fnFetchData()
  }, []);

  const fnFetchData = async () => {
      var companyid = sessionStorage.getItem('companyid')
      var uid = sessionStorage.getItem('uid')
      
      let sql_indicators = `
        SELECT 
            COALESCE(SUM(CASE WHEN o.isactive = 1 AND op.isactive = 1 THEN op.quantity * op.price ELSE 0 END), 0) as total_revenue,
            COALESCE(SUM(CASE WHEN p.isactive = 1 AND p.quantity > 0 THEN p.quantity ELSE 0 END), 0) as total_inventory,
            COUNT(CASE WHEN o.isactive = 1 THEN 1 END) as total_orders,
            COUNT(CASE WHEN o.isactive = 1 AND o.status = 1 THEN 1 END) as pending_orders
        FROM orders o
        LEFT JOIN order_products op ON o.id = op.orderid AND op.isactive = 1,
        (SELECT 1) as dummy
        LEFT JOIN products p ON p.isactive = 1 AND p.quantity > 0;
      `

      let sql_line = `
        SELECT 
                MONTH(FROM_UNIXTIME(o.orderdate / 1000)) as month_number,
                MONTHNAME(FROM_UNIXTIME(o.orderdate / 1000)) as month_name,
                COALESCE(SUM(op.quantity * op.price), 0) as revenue
            FROM orders o
            INNER JOIN order_products op ON o.id = op.orderid AND op.isactive = 1
            WHERE o.isactive = 1 
                AND YEAR(FROM_UNIXTIME(o.orderdate / 1000)) = YEAR(CURDATE())
            GROUP BY MONTH(FROM_UNIXTIME(o.orderdate / 1000)), MONTHNAME(FROM_UNIXTIME(o.orderdate / 1000))
            ORDER BY month_number
      `
      try {
        const data = await fnGetDirectData('dashboard',sql_indicators);
        const data2 = await fnGetDirectData('dashboardlinechart',sql_line);

        console.log(data2)

        setRevenue(data[0].total_revenue)
        setInventory(data[0].total_inventory)
        setOrders(data[0].total_orders)
        setTotalPending(data[0].pending_orders)
      } catch (error) {
      console.log(error)
      }
  };

  return (
    <div className="app" style={{width: '100%', height: '98%',overflowY: 'scroll',scrollbarWidth: 'none'}}>
      <div className="container">
        <h1 className="dashboard-title" style={{color: '#4361ee',marginBottom: '30px'}}><DotChartOutlined /> Dashboard</h1>
        <Row>
            <Col span={24}>
                <StatsCards revenue={revenue} inventory={inventory} orders={orders} totalPending={totalPending}/>
            </Col>
        </Row>
        
        <Row>
            <Col span={15}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Sales Revenue</h2>
                    <LineChart
                        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                        series={[
                            {
                            data: [2, 5.5, 2, 8.5, 1.5, 5],
                            area: true,
                            },
                        ]}
                        height={300}
                    />
                </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={8}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Sales by Category</h2>
                    <PieChart
                        series={[
                            {
                            data: [
                                { id: 0, value: 10, label: 'series A' },
                                { id: 1, value: 15, label: 'series B' },
                                { id: 2, value: 20, label: 'series C' },
                            ],
                            },
                        ]}
                        width={200}
                        height={200}
                    />
                </Card>
            </Col>
        </Row>

        {/* <Row style={{marginTop: '30px'}}>
            <Col span={12}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Recent Orders</h2>
                    <div className="orders-table-container">
                        <table className="orders-table">
                        <thead>
                            <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customername}</td>
                                <td>{order.orderdate}</td>
                                <td>${order.order_total}</td>
                                <td><GetStatusBadge status={order.status} /> </td>
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
                </Card>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
                <Card style={{ width: '100%', height: '350px'}}>
                    <h2 style={{fontSize: '1.1rem',fontWeight: '600'}}>Top Products</h2>
                    <div className="orders-table-container">
                        <table className="orders-table">
                        <thead>
                            <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customername}</td>
                                <td>{order.orderdate}</td>
                                <td>${order.order_total}</td>
                                <td><GetStatusBadge status={order.status} /> </td>
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
                </Card>
            </Col>
        </Row> */}
        
      </div>
    </div>
  );
};


// Stats Cards Component
const StatsCards = ({revenue, inventory, order, totalPending }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card primary">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Total Revenue</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4361ee', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <DollarOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>${revenue}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#dc3545'}}><ArrowDownOutlined /> 9.87%</Col> */}
        </Row>
      </div>
      <div className="stat-card success">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Inventory</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <BookOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{inventory}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
      </div>
      <div className="stat-card warning">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Orders</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <ShoppingCartOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{order}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
      </div>
      <div className="stat-card warning">
        <Row style={{marginBottom: '11px'}}>
            <Col span={20} style={{color: '#6c757d', fontSize: '0.9rem', fontWeight: 500,paddingTop: '10px'}}>Pending Orders</Col>
            <Col span={2}>
                <div style={{backgroundColor: '#4cc9f0', width: '35px',height: '35px',borderRadius: '8px',display: 'flex',alignItems: 'center',justifyContent: 'center',color: '#fff'}}>
                    <ShoppingCartOutlined style={{fontSize: '20px'}}/>
                </div>
            </Col>
        </Row>
        <Row style={{marginBottom: '5px'}}>
            <Col span={24}style={{fontSize: '1.8rem', fontWeight: 700}}>{totalPending}</Col>
        </Row>
        <Row>
            {/* <Col span={24} style={{color: '#28a745'}}><ArrowUpOutlined />8.3%</Col> */}
        </Row>
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

export default Dashboard;