import React,{ useRef, useState, useEffect } from 'react'
import {Col, Row,Button, Input, Space, Table,FloatButton,Tooltip,Spin,Switch   } from 'antd';
import { SearchOutlined,EditOutlined,PlusOutlined,FormOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fnGetData } from '../../shared/shared';
import {useNavigate } from 'react-router-dom'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const contentStyle = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 4,
};

const content = <div style={contentStyle} />;


function Clients() {
    
  const navigate = useNavigate()

   const fnAddEditClient = (record) => {
    let temp = {
      id: record.id,
      clientname: record.clientname,
      clientemail: record.clientemail,
      clientphonenumber: record.clientphonenumber,
      companyname: record.companyname,
      contactemail: record.contactemail,
      contactmethod: record.contactmethod,
      contactname: record.contactname,
      contactphone: record.contactphone,
      country: record.country,
      role: record.role,
      streetaddress: record.streetaddress,
      website: record.website,
      city: record.city,
      notes: record.notes,
      companyid: record.companyid,
      createdby: record.createdby,
      createddate: record.createddate,
      isactive: record.isactive
  }
    navigate("/client",{
      state: temp
    })
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchClients = async () => {
      var companyid = sessionStorage.getItem('companyid')
      const data = await fnGetData('clients',"clients", {companyid: companyid}, { columns: '*'});
      setClients(data);
      setFilteredClients(data)
      setLoading(!loading)
    };

    fetchClients();

  },[])

  const handleClose = () => {
    setLoading(!loading)
  };

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };
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

  const columns = [
    Object.assign(
    {
        title: 'Client',
        dataIndex: 'clientname',
        key: 'clientname',
        width: '20%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('clientname')
    ),
    Object.assign(
    {
        title: 'Client NO.',
        dataIndex: 'clientphonenumber',
        key: 'clientphonenumber',
        width: '20%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('clientphonenumber')
    ),
    Object.assign(
    {
        title: 'Email',
        dataIndex: 'clientemail',
        key: 'clientemail',
        width: '20%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('clientemail')
    ),
     Object.assign(
    {
        title: 'Contact person',
        dataIndex: 'contactname',
        key: 'contactname',
        width: '20%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('contactname')
    ),
     Object.assign(
    {
        title: 'Phone NO.',
        dataIndex: 'contactphone',
        key: 'contactphone',
        width: '15%',
        onCell: (record) => ({
        style: {
            // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
            fontFamily: "'Poppins', sans-serif",
        }
        }),
    },
    getColumnSearchProps('contactphone')
    ),
    Object.assign(
      {
          title: 'Active',
          dataIndex: 'isactive',
          key: 'isactive',
          width: '20%',
          onCell: (record) => ({
          style: {
              // color: record.firstname === 'Admin' ? 'red' : 'black', // customize as needed
              fontFamily: "'Poppins', sans-serif",
          }
          }),
          render: (isactive) => {
            return(
              <>
                {
                    isactive === 0 ? (
                        <Switch checked={false} disabled={true} />
                    ):(
                        <Switch checked={true} disabled={true}  />
                    )
                }
              </>
            )
          },
      },
    ),
    Object.assign(
        {
      title: 'Action',
      key: 'operation',
      width: '5%',
      fixed: 'right',
      render: (record) => (
        <>
        <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} style={{backgroundColor: 'lightgreen', marginLeft: 8}} onClick={() => fnAddEditClient(record) }/>
        </Tooltip>
        </>
      ),
    },
    )
  ]

  const fnHandleSearch = (e) => {
    setFilteredClients(clients.filter(c => c.clientname.toLowerCase().includes(e.toLowerCase())))
  }

  return (
    <Row style={{padding: 15, height: '100vh', backgroundColor: '#fff',overflowY: 'scroll',scrollbarWidth: 'none'}}>
        <div className="container">
          <h1 className="dashboard-title">Clients</h1>
          <div className="filters-section">
            <div className="filters-row">
              <div className="search-box">
                <Input.Search placeholder="search by client name" size="large" onChange={(e) => fnHandleSearch(e.target.value)}/>
              </div>
              <div className="filter-group">
              </div>
            </div>
          </div>
        
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Client NO.</th>
                  <th>Email</th>
                  <th>Contact person</th>
                  <th>Phone NO.</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id}>
                      <td>{client.clientname}</td>
                      <td>{client.clientphonenumber}</td>
                      <td>{client.clientemail}</td>
                      <td>{client.contactname}</td>
                      <td>{client.contactphone}</td>
                      <td>{
                        client.isactive == 1 ? (
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
                            onClick={() => fnAddEditClient(client) }
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
                      No clients found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
            <FloatButton
              onClick={() => fnAddEditClient({})}
              shape="circle"
              type="primary"
              style={{ insetInlineEnd: 24 }}
              icon={<Tooltip placement="top" title={'New client'}><PlusOutlined /></Tooltip>}
            />

    </Row>
  )
}

export default Clients