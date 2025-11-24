import React,{ useState, useEffect,useMemo } from 'react';
import { Card, Checkbox,Select,Radio,notification } from 'antd';
import {pages } from '../../shared/shared';
import {fnGetData,fnCreateData,fnUpateData } from '../../shared/shared';
import { useNavigate,useLocation } from 'react-router-dom'

const { Option } = Select;

const Context = React.createContext({ name: 'Default' });
let placement = 'topRight'

const PermissionsTab = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([])
  const [permissions, setPermissions] = useState(location.state)
  const [isactive, setIsactive] = useState(1)
  const [groups, setGroups] = useState([])
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchDepartment()
  },[])

  const fnGoBack = () => {
    navigate('/permissionslist')
  }

  const fetchDepartment = async () => {
    var companyid = sessionStorage.getItem('companyid')
    const data = await fnGetData('groups',"user_groups", {companyid: companyid}, { columns: '*'});
    setGroups(data);

    if(JSON.stringify(permissions) != "{}" ){
      let arr = permissions.permissions.split(',').map(Number);
      setSelectedOptions(arr)
      setSelectedGroup(permissions.groupid)
      setIsactive(permissions.isactive)
    }
  };

  const handleSavePermissions = () => {
    if(selectedGroup == null){
      alert('select a group')
      return
    }

    if(selectedOptions.length == 0 ){
      alert('select pages')
      return
    }

    let arr = []
    arr = selectedOptions
    arr.push(100)

    var companyid = sessionStorage.getItem('companyid')
    let obj = {
      groupid: selectedGroup,
      permissions: arr.join(),
      isactive: isactive,
      companyid: companyid
    }
    
    const fnSendData = async () => {
        try {
          if(JSON.stringify(permissions) === "{}" ){
            const data = await fnCreateData('groups',"group_permissions", obj, 'new');
            
            if(data.insertId != null || data.insertId != undefined){
              api.success({
                  title: ``,
                  description: 'Permission created successfully.',
                  placement,duration: 2,
                  style: {
                      background: "#e2e2e2ff"
                  },
                  onClose: () => {
                      fnGoBack()
                  }
              });
            }else{
              api.error({
                  title: ``,
                  description: 'Something went wrong. Please try again',
                  placement,duration: 2,
                  style: {
                      background: "#e2e2e2ff"
                  },
              });
            }
          }else{
              const data = await fnUpateData('groups',"group_permissions", obj,'id = ?',[permissions['id']], 'update');
              if(data?.affectedRows > 0){
                api.success({
                    title: ``,
                    description: 'Permission updated successfully.',
                    placement,duration: 2,
                    style: {
                        background: "#e2e2e2ff"
                    },
                    onClose: () => {
                        fnGoBack()
                    }
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


  const handleChange = (checkedValues) => {
    setSelectedOptions(checkedValues);
  };

  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  return (
    <Context.Provider value={contextValue}>
    {contextHolder}
    <div id="permissions" style={{
      padding: '20px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      overflowY: 'scroll',scrollbarWidth: 'none',
      height: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: 0, color: '#333', fontSize: '1.5rem' }}>
          Page Permissions
        </h3>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="groupSelect" style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: '600',
          color: '#555'
        }}>
          Select User Group
        </label>
        <Select defaultValue={selectedGroup} style={{ width: '100%' }} placeholder="Please select a group" onChange={e => setSelectedGroup(e)} size='large'> 
            { 
                groups?.map((itm,key) => (
                <Option key={key} value={itm.id}>{itm.title}</Option>
                ))
            }
        </Select>
      </div>
      
      <h4 style={{ margin: '20px 0 10px' }}>Page Access Permissions</h4>
      
      <div style={{
        display: 'grid',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <Checkbox.Group onChange={handleChange} value={selectedOptions} >
          {
            pages.map(page => (
              <Checkbox key={page.id} value={page.id}>
                <Card style={{ width: 140 }} className='permissions_card'>
                  {page.title}
                </Card>
              </Checkbox>
                
            ))
          }
        </Checkbox.Group>
        
      </div>

      <div className="form-group">
        <label>Active</label>
        <Radio.Group onChange={e => setIsactive(4)} defaultValue={isactive}>
            <Radio value={0}> No </Radio>
            <Radio value={1}> Yes </Radio>
        </Radio.Group>
      </div>
      
      {/* <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button 
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#28a745',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          onClick={handleSavePermissions}
        >
          Save Permissions
        </button>
      </div> */}
      <div className="form-actions">
        <button onClick={handleSavePermissions} className="btn btn-primary">
            Save Permissions
        </button>
        <button type="button" className="btn btn-light" onClick={() => fnGoBack()}>
            Cancel
        </button>
        </div>
    </div>
    </Context.Provider>
  );
};

export default PermissionsTab;